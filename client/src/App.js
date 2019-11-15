import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" render={() => <Navbar />} />
        <Route exact path="/" render={() => <Landing />} />
      </Router>
    </div>
  );
}

export default App;
