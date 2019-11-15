import React, { Component } from "react";
import tickers from "../utils/symbols.json";
import escapeRegExp from "escape-string-regexp";

class Landing extends Component {
  state = {
    ticker: ""
  };
  onChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  showlingTickers = () => {};
  render() {
    const { ticker } = this.state;
    let showingTickers;
    if (ticker) {
      const match = new RegExp(escapeRegExp(ticker), "i");
      showingTickers = tickers.filter(tick => match.test(tick["SYMBOL"]));
    } else{
      showingTickers = tickers
    }
    return (
      <div className="wrapper">
        <div className="col-md-3 landing_left">
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2 ticker_input"
              type="search"
              placeholder="Search"
              aria-label="Search"
              name="ticker"
              onChange={this.onChange}
            />
            <button
              className="ticker_button btn btn-outline-success my-2 my-sm-0 "
              type="submit"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 17 18"
                className=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="#fff" fillRule="evenodd">
                  <path
                    className="_2BhAHa"
                    d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.02l-4.216-4.203"
                  />
                  <path
                    className="_2BhAHa"
                    d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467"
                  />
                </g>
              </svg>
            </button>
          </form>
          <ul className="tickers_list list-group">
            {showingTickers.map((ticker, index) => {
              return (
                <li key={index} className="ticker_list_item list-group-item">
                  {ticker["SYMBOL"]}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-md-9 landing_right">WOeld</div>
      </div>
    );
  }
}

export default Landing;
