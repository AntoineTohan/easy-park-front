/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IMapMarker } from "../../MapWrapper";
import InfoCard from "./InfoCard";
import "./InfoList.css";

interface IPropsInfoList {
  markers: IMapMarker[];
  infoWindow: google.maps.InfoWindow;
  map: google.maps.Map<HTMLDivElement>;
  handleClickSetCurrentMarker(index: number): void;
  vicinityOrigin: string;
}

export default class InfoList extends React.PureComponent<IPropsInfoList, {}> {
  private directionsRenderer: google.maps.DirectionsRenderer = new window.google.maps.DirectionsRenderer();
  private directionsService: google.maps.DirectionsService = new window.google.maps.DirectionsService();
  constructor(props: IPropsInfoList) {
    super(props);
    this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this);
  }

  componentDidMount() {
    this.directionsRenderer.setMap(this.props.map);
  }

  private calculateAndDisplayRoute(vicinity: string | undefined) {
    this.directionsService.route(
      {
        origin: { query: this.props.vicinityOrigin},
        destination: { query: vicinity },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (
        response: google.maps.DirectionsResult,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === "OK") {
          this.directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  render() {
    return (
      <div className="col-sm-8 col-lg-2 pr-0 pl-0">
        <div className="listing w-100">
          {this.props.markers.map((m: IMapMarker, i: number) => {
            return (
              <InfoCard
                index={i}
                mapMarker={m}
                infoWindow={this.props.infoWindow}
                calculateAndDisplayRoute={this.calculateAndDisplayRoute}
                handleClickSetCurrentMarker={this.props.handleClickSetCurrentMarker}
                key={i}
              ></InfoCard>
            );
          })}
        </div>
      </div>
    );
  }
}
