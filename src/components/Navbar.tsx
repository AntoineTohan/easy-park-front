/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import logo from "../ressources/easy-park-navbar-icon.png";

export default class Navbar extends React.PureComponent<{}, {}> {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand font-weight-bold" href="#">
          <img src={logo} className="navbar-logo" alt="logo" />
          Easy Park
        </a>
      </nav>
    );
  }
}
