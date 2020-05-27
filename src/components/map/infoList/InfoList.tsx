/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IMapMarker } from "../MapWrapper";
import InfoCard from "./InfoCard";
import "./InfoList.css";

interface IPropsInfoList {
  markers: IMapMarker[];
  infoWindow: google.maps.InfoWindow;
}

export default class InfoList extends React.PureComponent<IPropsInfoList, {}> {
  render() {
    return (
      <div className="col-sm-8 col-lg-2 pr-0 pl-0">
        <div className="listing w-100">
          {this.props.markers.map((m: IMapMarker, i: number) => {
            return (
             <InfoCard index={i} mapMarker={m} infoWindow={this.props.infoWindow}></InfoCard>
            );
          })}
        </div>
      </div>
    );
  }
}
