/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./InfoCard.css";

export default class InfoCardPlaces extends React.PureComponent {
  render() {
    const totalPlaces = Math.floor(Math.random() * 500);
    const availablePlaces = Math.floor(Math.random() * totalPlaces);
    return (
      <>
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
      </>
    );
  }
}
