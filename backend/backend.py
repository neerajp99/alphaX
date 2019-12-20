#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Import Libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime
import mibian
import json
import threading
import socket


# In[2]:


# Dummy function to return underlying ltp
def get_underlying_ltp():
    return 32013

# Class for Trade Legs


class Leg():

    # Initialize object parameters
    def __init__(self, underlying, expiry, qty, opt_type, strike, price):
        # Option Expiry
        self.expiry = expiry.upper()
        # Option Quantity
        self.qty = qty
        # Option Type
        self.opt_type = opt_type
        # option Strike
        self.strike = strike
        # option Strike
        self.underlying = underlying.upper()

        # Expiry Date
        day_of_exp = datetime.datetime.strptime(self.expiry, '%d%b%Y').date()

        # Today Date
        today = datetime.datetime.now().date()

        # Days to Expiry
        dte = np.max([(day_of_exp - today).days, 0]) + 0.000000001

        # Set Underlying LTP
        self.underlying_price = get_underlying_ltp()

        ### Fetch LTP & IV from option chains ###

        # If call option...
        if self.opt_type == 'C':
            # Locate LTP of corresponding call strike
            self.entry_price = float(price)
            # Create BS model for call option with price as input
            bs = mibian.BS([self.underlying_price, self.strike,
                            6.47, dte], callPrice=self.entry_price)
            # Compute IV
            self.iv = bs.impliedVolatility
            # Create BS model for call option with IV as input
            bs = mibian.BS([self.underlying_price, self.strike,
                            6.47, dte], volatility=self.iv)
            # Delta
            self.delta = bs.callDelta
            # Theta
            self.theta = bs.callTheta

        # If put option...
        elif self.opt_type == 'P':
            # Locate LTP of corresponding put strike
            self.entry_price = float(price)
            # Create BS model for put option with price as input
            bs = mibian.BS([self.underlying_price, self.strike,
                            6.47, dte], putPrice=self.entry_price)
            # IV
            self.iv = bs.impliedVolatility
            # Create BS model for put option with IV as input
            bs = mibian.BS([self.underlying_price, self.strike,
                            6.47, dte], volatility=self.iv)
            # Delta
            self.delta = bs.putDelta
            # Theta
            self.theta = bs.putTheta

        # Gamma
        self.gamma = bs.gamma
        # Vega
        self.vega = bs.vega

        # Dummy Strikes
        self.strikes = list(
            range(int(self.underlying_price * 0.9), int(self.underlying_price * 1.1), 100))
        self.strikes = list(np.floor(np.array(self.strikes) / 100) * 100)

        # Underlying price Range
        self.underlying_range = pd.Series(self.strikes)

        # Greeks of Trade
        self.greeks = np.array(
            [self.delta, self.gamma, self.theta, self.vega]) * self.qty

    ### Compute Payoff at Expiry ###
    def compute_expiry_payoff(self):

        # If Call option...
        if self.opt_type == 'C':
            # If long self.calls...
            if self.qty > 0:
                # expiry_payoff = max(self.underlying_range- strike - premium, -premium) ???
                self.expiry_payoff = (self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, 0.00000001], volatility=self.iv).callPrice) - self.entry_price) * abs(self.qty)
            # If short self.calls...
            elif self.qty < 0:
                # expiry_payoff = min(- self.underlying_range+ strike + premium, premium) ???
                self.expiry_payoff = (self.entry_price - self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, 0.00000001], volatility=self.iv).callPrice)) * abs(self.qty)
        # If Put option...
        elif self.opt_type == 'P':
            # If long self.puts...
            if self.qty > 0:
                # expiry_payoff = max(strike - self.underlying_range- premium, -premium) ???
                self.expiry_payoff = (self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, 0.00000001], volatility=self.iv).putPrice) - self.entry_price) * abs(self.qty)
            # If short self.puts...
            elif self.qty < 0:
                # expiry_payoff = min(- strike + self.underlying_range+ premium, premium) ???
                self.expiry_payoff = (self.entry_price - self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, 0.00000001], volatility=self.iv).putPrice)) * abs(self.qty)

        # Set underlying price range as index
        self.expiry_payoff.index = self.underlying_range

        return self.expiry_payoff

    ### Compute payoff on arbitrary day ###
    def compute_payoff(self, date=None, dte=None, iv_now=None):
        day_of_exp = datetime.datetime.strptime(self.expiry, '%d%b%Y').date()
        today = datetime.datetime.strptime(date, '%d%b%Y').date()
        dte = np.max([(day_of_exp - today).days, 0]) + 0.000000001

        if iv_now == None:
            iv_now = self.iv

        # If Call option...
        if self.opt_type == 'C':
            # If long self.calls...
            if self.qty > 0:
                # payoff = max(self.underlying_range- strike - premium, -premium) ???
                self.payoff = (self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, dte], volatility=iv_now).callPrice) - self.entry_price) * abs(self.qty)
            # If short self.calls...
            elif self.qty < 0:
                # payoff = min(- self.underlying_range+ strike + premium, premium) ???
                self.payoff = (self.entry_price - self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, dte], volatility=iv_now).callPrice)) * abs(self.qty)
        # If Put option...
        elif self.opt_type == 'P':
            # If long self.puts...
            if self.qty > 0:
                # payoff = max(strike - self.underlying_range- premium, -premium) ???
                self.payoff = (self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, dte], volatility=iv_now).putPrice) - self.entry_price) * abs(self.qty)
            # If short self.puts...
            elif self.qty < 0:
                # payoff = min(- strike + self.underlying_range+ premium, premium) ???
                self.payoff = (self.entry_price - self.underlying_range.apply(lambda x: mibian.BS(
                    [x, self.strike, 6.47, dte], volatility=iv_now).putPrice)) * abs(self.qty)

        # Set underlying price range as index
        self.payoff.index = self.underlying_range

        return self.payoff

    # Display Properties of Trade Leg
    def properties(self): print(self.expiry, self.qty,
                                self.opt_type, self.strike, self.entry_price, self.iv)

    # Display Greeks of Trade Leg
    def display_greeks(self): print(
        self.delta, self.gamma, self.theta, self.vega)


# # Function Call
#
# #### payoff(# of legs, dataframe of legs indexed from 0 and columns = [underlying, expiry, quantity, opt_type, strike, price])

# In[3]:


legs_data = pd.DataFrame(
    columns=['underlying', 'expiry', 'quantity', 'opt_type', 'strike', 'price'])


# In[4]:


legs_data.loc[0] = ['banknifty', '26dec2019', 1, 'C', 32200, 300.85]
legs_data.loc[1] = ['banknifty', '26dec2019', 1, 'P', 32200, 167.90]
legs_data.loc[2] = ['banknifty', '26dec2019', 2, 'P', 31300, 18.20]
legs_data.loc[3] = ['banknifty', '29dec2019', -3, 'P', 30900, 10.00]


# In[5]:


legs_data


# In[6]:


def get_payoff_data(no_of_legs, legs_data):

    # List to store leg objects
    leg_objects = []

    # Get LTP
    ltp = get_underlying_ltp()

    # Iterate over no. of legs
    for x in range(no_of_legs):
        # Get parameter values of this leg from dataframe
        underlying, expiry, quantity, opt_type, strike, price = legs_data.loc[x].values
        # Create objects for each leg
        leg_objects.append(
            Leg(underlying, expiry, quantity, opt_type, strike, price))

    # Compute Current Payoff
    # Get today's date
    date = datetime.datetime.now().date()
    date = str(date.day) + date.strftime("%B")[:3] + str(date.year)

    iv = None

    strikes = leg_objects[0].strikes

    # Declare array to store leg payoffs
    payoff = np.zeros(len(strikes))

    # Iterate over legs and accumulate payoff
    for x in range(no_of_legs):
        payoff += leg_objects[x].compute_payoff(date=date, iv_now=iv).values

    # Create payoff dataframe
    payoff_data = pd.DataFrame(payoff, index=strikes)
    payoff_data.dropna(inplace=True)

    # Compute Expiry Payoff

    # Compute days to expiry for all contracts
    dtes = (legs_data['expiry'].apply(lambda x: datetime.datetime.strptime(
        x, '%d%b%Y').date()) - datetime.datetime.now().date())

    # Find nearest expiry index
    nearest_expiry_index = dtes[dtes == dtes.min()].index[0]

    # Nearest Expiry
    nearest_expiry = legs_data.loc[nearest_expiry_index]['expiry']

    date = nearest_expiry
    iv = None

    # Declare array to store leg payoffs
    payoff = np.zeros(len(strikes))

    # Iterate over legs and accumulate payoff
    for x in range(no_of_legs):
        payoff += leg_objects[x].compute_payoff(date=date, iv_now=iv).values

    payoff_data[1] = pd.Series(payoff, index=strikes)
    payoff_data.columns = ['current_payoff', 'expiry_payoff']

    payoff_data.index.name = 'underlying_price'

    # Return dataframe
    return payoff_data


# In[10]:


# Function Call
get_payoff_data(4, legs_data).to_json()


# In[ ]:


class instance_s:
    def __init__(self, addr, sock):
        self.addr = addr
        self.sock = sock

    def handle(self):
        try:
            # Receive Data and parse json from it
            self.data = self.sock.recv(1024).strip()
            loaded = json.loads(self.data)

            # Create a dataframe with all the legs
            legs_data = pd.DataFrame(loaded['Legs'])

            # Call the payoff analysis function and convert its output to json
            tosend = get_payoff_data(loaded['no_legs'], legs_data).to_json()
            print(tosend)

            # Send back json
            self.sock.sendall(bytes(json.dumps(tosend), "utf-8"))
            self.sock.close()
            print("Closed Connection From : ", self.addr)
        except:
            pass


s = socket.socket()

port = 9090
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('', port))  # Not binding to specific IP

print("Server running on : ", port)  # Succeful binding

s.listen()  # Start listening
print("Socket is listening")

while(True):
    sock, addr = s.accept()
    print("New Connection From : ", addr)
    # New instance of class to handle each connection simultaneously
    ins = instance_s(addr, sock)
    # Start new thread for each new connection
    thread = threading.Thread(target=ins.handle)
    thread.start()  # Thread started
