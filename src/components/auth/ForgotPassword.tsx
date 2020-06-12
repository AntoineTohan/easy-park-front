import React from "react";
import { Link } from "react-router-dom";
import logo from "../../ressources/easy-park-navbar-icon.png";

export default class ForgotPassword extends React.PureComponent<{}, {}> {
  render() {
    return (
      <form className="form-signin">
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Mot de passe oublié?</h1>
        <label className="sr-only">Adresse email</label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Adresse email"
        />
        <span className="mt-3">
        <Link to="/map">
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Envoie de email
          </button>
        </Link>
        </span>
          <Link to="/">S'inscrire</Link>
        <p className="mt-5 mb-3 text-muted">© 2019-2020 Easy'Park</p>
      </form>
    );
  }
}
