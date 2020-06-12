/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IMapMarker } from "../MapWrapper";
import InfoList from "./infoList/InfoList";

interface IPropsInfoPanel {
  markers: IMapMarker[];
  infoWindow: google.maps.InfoWindow;
  map: google.maps.Map<HTMLDivElement>;
  vicinityOrigin: string;
}

interface IState {
  showFocus: boolean;
  indexFocusMarker: number;
}

export default class InfoPanel extends React.PureComponent<
  IPropsInfoPanel,
  IState
> {
  constructor(props: IPropsInfoPanel) {
    super(props);
    this.state = {
      showFocus: false,
      indexFocusMarker: 0,
    };
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
  }

  private setCurrentMarker(index: number) {
    this.setState({ indexFocusMarker: index });
  }
  render() {
    return (
      <>
        <InfoList
          markers={this.props.markers}
          infoWindow={this.props.infoWindow}
          map={this.props.map!}
          handleClickSetCurrentMarker={this.setCurrentMarker}
          vicinityOrigin={this.props.vicinityOrigin}
        />
      </>
    );
  }
}
