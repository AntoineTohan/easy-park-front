import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import carIcon from "../../ressources/car-icon.png";

export default class Profile extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3 mb-2">
            <div className="text-center">
              <img
                src={carIcon}
                className="avatar img-circle img-thumbnail mb-2 h-75 w-75"
                alt="avatar"
              />
              <input
                type="file"
                className="text-center center-block file-upload"
              />
            </div>
            <hr />
            <ul className="list-group">
              <li className="list-group-item text-muted">
                <strong>
                  Parkings favoris{" "}
                  <FontAwesomeIcon icon={faStar} color="#ffc107" />{" "}
                  <i className="fa fa-dashboard fa-1x"></i>
                </strong>
              </li>
              <li className="list-group-item text-center">
                <span className="text-left">Parking Comedy</span>
              </li>
              <li className="list-group-item text-center">
                <span className="pull-left">Parking Polygon</span>
              </li>
              <li className="list-group-item text-center">
                <span className="pull-left">Parking Covoiturage</span>
              </li>
            </ul>
          </div>
          <div className="col-sm-9 mb-3">
            <div id="profile">
              <h2 className="mb-0 mt-3">Profile</h2>
              <hr />
              <form>
                <div className="row">
                  <div className="col mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Prénom"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Mot de passe"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirmer mot de passe"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Adresse email"
                    />
                  </div>
                </div>
              </form>
              <button type="button" className="btn btn-success btn-lg mt-3">
                Mettre à jours
              </button>
            </div>
            <div id="reservation">
              <hr />
              <h2 className="mb-0 mt-3 mr-0">Reservation</h2>
              <table className="table mt-3 mb-6">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Nom parking</th>
                    <th scope="col">N° place</th>
                    <th scope="col">Début de réservation</th>
                    <th scope="col">Durée estimée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Parking Comedy</th>
                    <td>P1 134</td>
                    <td>11 juin 13h00</td>
                    <td>4h</td>
                  </tr>
                  <tr>
                    <th>Parking Comedy</th>
                    <td>P4 134</td>
                    <td>12 juin 20h</td>
                    <td>1h</td>
                  </tr>
                  <tr>
                    <th>Parking Covoiturage</th>
                    <td>P30</td>
                    <td>15 juin 8h00</td>
                    <td>9h</td>
                  </tr>
                </tbody>
              </table>
              <hr />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
