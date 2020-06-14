/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IMapMarker } from "../../MapWrapper";
import "./InfoCard.css";

interface IPropsInfoCardPlaces {
  mapMarker: IMapMarker;
  free: number;
}

export default class InfoCardPlaces extends React.PureComponent<
  IPropsInfoCardPlaces,
  {}
> {
  render() {
    const totalPlaces = this.props.mapMarker.parking
      ? this.props.mapMarker.parking[0].total
      : 0;
    const availablePlaces = this.props.free
      ? this.props.free
      : 0;
    return (
      <>
        {this.props.mapMarker.parking ? (
          <div>
            {availablePlaces > 0 ? (
              <p className="font-place">
                <span className="darkgreen">{availablePlaces}</span> /{" "}
                <span className="darkred">{totalPlaces}</span>
              </p>
            ) : (
              <p className="font-place">
                <span className="darkred">COMPLET</span>
              </p>
            )}
          </div>
        ) : (
          <p className="font-place">
            <span className="darkred">Aucunes informations</span>
          </p>
        )}
      </>
    );
  }
}
