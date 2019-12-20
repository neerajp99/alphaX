import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Route exact path="/" render={() => <Navbar />} />
          <Route exact path="/" render={() => <Landing />} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
