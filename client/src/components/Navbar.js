import React, { Component } from "react";
class Navbar extends Component {
  render() {
    return (
      <div className="navbar navbar-expand-lg navbar-dark standard_navbar">
      <a className="navbar-brand standard_heading" href="#">
        {" "}
        Quant Mafia
      </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <form className="form-inline my-2 my-lg-0 standard_form">
            <button className="btn btn-outline-success my-2 my-sm-0 standard_register_button">
              Register
            </button>
            <button className="btn btn-outline-success my-2 my-sm-0 standard_login_button">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Navbar;
