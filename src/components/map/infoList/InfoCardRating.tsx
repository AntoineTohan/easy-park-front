/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IMapMarker } from "../MapWrapper";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./InfoCard.css";

interface IPropsInfoCardRating {
  mapMarker: IMapMarker;
}

export default class InfoCardRating extends React.PureComponent<
  IPropsInfoCardRating,
  {}
> {
  render() {
    return (
      <h6 className="card-subtitle mb-2 text-muted">
        <Rating
          emptySymbol={<FontAwesomeIcon icon={faStar} />}
          fullSymbol={<FontAwesomeIcon icon={faStar} color="#e7711b" />}
          fractions={2}
          readonly
          initialRating={this.props.mapMarker.result.rating}
        />
        {this.props.mapMarker.result.user_ratings_total && (
          <>({this.props.mapMarker.result.user_ratings_total})</>
        )}
      </h6>
    );
  }
}
