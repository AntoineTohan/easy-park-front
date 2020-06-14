import React from "react";
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../ressources/easy-park-navbar-icon.png";
import "./Login.css";

export default function Register() {
  const history = useHistory();
  function handleClickRegister() {
    Swal.fire({
      title: "Vous êtes inscrit",
      icon: "success",
      text: "Vous êtes bien inscrit sur Easy'Park.",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.value) {
        history.push("/");
      }
    });
  }
  return (
    <form className="form-signin">
      <img className="mb-4" src={logo} alt="" width="72" height="72" />
      <h1 className="h3 mb-3 font-weight-normal">Inscription</h1>
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
      <span
        onClick={() => handleClickRegister()}
        className="btn btn-lg btn-primary btn-block mt-2"
      >
        S'inscricre
      </span>
      <Link to="/">Se connecter</Link>
      <p className="mt-5 mb-3 text-muted">© 2019-2020 Easy'Park</p>
    </form>
  );
}
