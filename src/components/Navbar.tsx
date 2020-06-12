/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { faPortrait } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../ressources/easy-park-navbar-icon.png";

interface IPropsNavbar {
  view: string;
}
export default class Navbar extends React.PureComponent<IPropsNavbar, {}> {
  constructor(props: IPropsNavbar) {
    super(props);
  }
  private renderViewSchedule() {
    if (this.props.view === "profile")
      return (
        <Link to="/map">
          <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2 ml-2" />
        </Link>
      );
    else
      return (
        <Link to="/profile">
          <FontAwesomeIcon icon={faPortrait} className="mr-2 ml-2" />
        </Link>
      );
  }
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand font-weight-bold" href="#">
          <Link to="/map">
            <img src={logo} className="navbar-logo" alt="logo" />
          </Link>
          Easy'Park
        </a>
        <div className="form-inline">
          <span className="mr-3"><strong>antoinetohan@gmail.com</strong></span>
          {this.renderViewSchedule()}
          <Link to="/">
            <FontAwesomeIcon icon={faPowerOff} className="mr-2 ml-2" />
          </Link>
        </div>
      </nav>
    );
  }
}
