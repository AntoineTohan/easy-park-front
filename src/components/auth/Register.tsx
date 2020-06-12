import React from "react";
import { Link } from "react-router-dom";
import logo from "../../ressources/easy-park-navbar-icon.png";
import "./Login.css";

export default class Register extends React.PureComponent<{}, {}> {
  render() {
    return (
      <form className="form-signin">
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Register</h1>
        <label>Prénom</label>
        <input
          type="text"
          id="intputFirstName"
          className="form-control"
          placeholder="Prénom"
        />
        <label>Nom</label>
        <input
          type="text"
          id="intputLastName"
          className="form-control"
          placeholder="Nom"
        />
        <label>Adresse email</label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Adresse email"
        />
        <label>Mot de passe</label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Mot de passe"
        />
        <label>Confirmer mot de passe</label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Confirmer mot de passe"
        />
        <Link to="/">
          <button
            className="btn btn-lg btn-primary btn-block mt-2"
            type="submit"
          >
            S'inscricre
          </button>
        </Link>
        <Link to="/">Se connecter</Link>
        <p className="mt-5 mb-3 text-muted">© 2019-2020 Easy'Park</p>
      </form>
    );
  }
}
