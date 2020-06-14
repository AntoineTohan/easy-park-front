/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { faParking } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { IMapMarker } from "../../MapWrapper";
import InfoCardPlaces from "./InfoCardPlaces";
import InfoCardRating from "./InfoCardRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./InfoCard.css";

interface IPropsInfoCard {
  mapMarker: IMapMarker;
  index: number;
  infoWindow: google.maps.InfoWindow;
  calculateAndDisplayRoute(vicinity: string | undefined): void;
  handleClickSetCurrentMarker(index: number): void;
  vicinityOrigin: string;
  vicinityDestination: string;
}

interface IState {
  free: number;
}
export default class InfoCard extends React.PureComponent<
  IPropsInfoCard,
  IState
> {
  constructor(props: IPropsInfoCard) {
    super(props);
    this.state = {
      free: this.props.mapMarker.parking
        ? this.props.mapMarker.parking![0].free
        : 0,
    };
    this.reservation = this.reservation.bind(this);
  }
  private reservation() {
    this.setState({ free: this.state.free - 1 });
  }
  private changeMarkerStyle(
    marker: google.maps.Marker,
    Zindex: number,
    url: string
  ) {
    marker.setZIndex(Zindex);
    marker.setIcon(url);
  }
  private handleMouseEnter(marker: google.maps.Marker) {
    window.google.maps.event.trigger(marker, "click");
    this.changeMarkerStyle(
      marker,
      20,
      "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png"
    );
  }
  private handleClose(marker: google.maps.Marker) {
    this.props.infoWindow.close();
    this.changeMarkerStyle(
      marker,
      10,
      "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png"
    );
  }
  private transformUrl(s: string) {
    const punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
    const finalString = punctuationless.replace(/\s{2,}/g, " ");
    console.log(finalString.replace(/\s/g, "+"));
    return finalString.replace(/\s/g, "+");
  }
  private handleClickItienary() {
    if (this.props.vicinityOrigin) {
      this.props.calculateAndDisplayRoute(this.props.mapMarker.result.vicinity);
      this.props.handleClickSetCurrentMarker(this.props.index);
      setTimeout(() => {
        const destination = this.transformUrl(
          this.props.mapMarker.result.name +
            " " +
            this.props.vicinityDestination
        );
        const origin = this.transformUrl(this.props.vicinityOrigin);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        const text = `Voici un lien d'iténaire Google Maps afin de vous rendre à : <strong>${this.props.mapMarker.result.name}</strong>. <br> <br> <a href="${url}" target="_blank">Itinéraire Google</a>`;
        Swal.fire({
          title: "Votre itinéraire !",
          icon: "success",
          html: text,
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          if (result.value) {
          }
        });
      }, 1500);
    }
  }
  private handleClickReversation() {
    const event = new Date();
    const numberE = Math.floor(Math.random() * 5);
    const numberP = Math.floor(Math.random() * 200);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const text = `Votre place parking ${
      this.props.mapMarker.result.name
    } a bien était réservée pour le ${event.toLocaleDateString(
      "fr-FR",
      options
    )} <br/><br> Votre place est suivante : <strong>étage ${numberE} place ${numberP}</strong>`;
    Swal.fire({
      title: "Vous avez bien reservé !",
      icon: "success",
      html: text,
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.value) {
        console.log(this.props.mapMarker.parking![0].name);
        axios
          .get(
            "http://localhost:8080/res/" +
              btoa(this.props.mapMarker.parking![0].name)
          )
          .then((res) => {
            this.reservation();
          });
      }
    });
  }
  render() {
    const style =
      this.props.index % 2 === 0
        ? { backgroundColor: "#F0F0F0" }
        : { backgroundColor: "#FFFFFF" };
    return (
      <div
        className="card"
        key={this.props.index}
        style={style}
        onMouseEnter={() => this.handleMouseEnter(this.props.mapMarker.marker)}
        onMouseLeave={() => this.handleClose(this.props.mapMarker.marker)}
      >
        <div className="card-body">
          <h5 className="card-title">{this.props.mapMarker.result.name}</h5>
          <InfoCardRating mapMarker={this.props.mapMarker} />
          <p className="card-text">{this.props.mapMarker.result.vicinity}</p>
          <InfoCardPlaces
            mapMarker={this.props.mapMarker}
            free={this.state.free}
          />
          <div className="container-fluid">
            <div className="row">
              {this.props.mapMarker.parking ? (
                <>
                  <div
                    className="col-sm-6 col-lg-6 darkblue"
                    onClick={() => this.handleClickReversation()}
                  >
                    <FontAwesomeIcon icon={faParking} />
                    <br />
                    <span className="link-style">Réserver sa place</span>
                  </div>
                  <div
                    className="col-sm-6 col-lg-6 darkblue"
                    onClick={() => this.handleClickItienary()}
                  >
                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                    <br />
                    <span className="link-style">Itinéraire</span>
                  </div>
                </>
              ) : (
                <div
                  className="col-sm-12 col-lg-12 darkblue"
                  onClick={() => this.handleClickItienary()}
                >
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                  <br />
                  <span className="link-style">Itinéraire</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
