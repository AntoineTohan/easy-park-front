/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IMapMarker } from "../MapWrapper";
import InfoCardPlaces from "./InfoCardPlaces";
import InfoCardRating from "./InfoCardRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faParking } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import "./InfoCard.css";

interface IPropsInfoCard {
  mapMarker: IMapMarker;
  index: number;
  infoWindow: google.maps.InfoWindow;
}

export default class InfoCard extends React.PureComponent<IPropsInfoCard, {}> {
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
          <p className="card-text font-italic">Ouvert 24h/24h</p>
          <InfoCardPlaces />
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6 col-lg-6 darkblue">
                <FontAwesomeIcon icon={faParking} />
                <br />
                <a href="#">Réserver sa place</a>
              </div>
              <div className="col-sm-6 col-lg-6 darkblue">
                <FontAwesomeIcon icon={faMapMarkedAlt} />
                <br />
                <a href="#">Itinéraire</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
