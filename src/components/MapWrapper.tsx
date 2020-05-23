import React from "react";
import marker from "../ressources/marker.png";
// import AutoCompleteInput from "./AutoCompleteInput";
import "./MapWrapper.css";

interface IState {
  markers: google.maps.places.PlaceResult[];
}

export default class MapWrapper extends React.PureComponent<{}, IState> {
  private googleMapRef = React.createRef<HTMLDivElement>();
  private autoCompleteRef = React.createRef<HTMLInputElement>();
  private autocomplete: google.maps.places.Autocomplete | null = null;
  private map: google.maps.Map<HTMLDivElement> | null = null;
  private places: google.maps.places.PlacesService | null = null;
  constructor() {
    super({});
    this.state = {
      markers: [],
    };
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    window.document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (this.googleMapRef.current) {
        this.map = new window.google.maps.Map(this.googleMapRef.current, {
          center: { lat: 46.2, lng: 2.2 },
          zoom: 5,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        if (this.autoCompleteRef.current) {
          this.autocomplete = new window.google.maps.places.Autocomplete(
            this.autoCompleteRef.current,
            {
              types: ["(regions)"],
              componentRestrictions: { country: "fr" },
            }
          );
          this.places = new window.google.maps.places.PlacesService(this.map);
          this.autocomplete.addListener("place_changed", this.onPlaceChanged);
        }
      }
    });
  }

  private filterByType(results: google.maps.places.PlaceResult[]) {
    return results.filter((r) => {
      const validParking = r.types!.includes("lodging" || "restaurant");
      return !validParking;
    });
  }

  private search() {
    if (this.map && this.places) {
      this.setState({ markers: [] });
      const search: google.maps.places.PlaceSearchRequest = {
        bounds: this.map.getBounds()!,
        types: ["parking"],
      };
      this.places.nearbySearch(
        search,
        (
          results: google.maps.places.PlaceResult[],
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            results.map((r: google.maps.places.PlaceResult, i: number) => {
              new window.google.maps.Marker({
                position: r.geometry ? r.geometry.location : undefined,
                animation: window.google.maps.Animation.DROP,
                map: this.map ? this.map : undefined,
              });
            });
            const markers = this.filterByType(results);
            this.setState({ markers });
          }
        }
      );
    }
  }

  private onPlaceChanged() {
    if (this.autocomplete && this.map) {
      const place = this.autocomplete.getPlace();
      this.map.panTo(place.geometry!.location);
      this.map.setZoom(12);
      this.search();
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="form-group">
          <label>Trouver les parkings de votre ville :</label>
          <input
            className="form-control mb-3"
            id="inputAutoComplete"
            type="text"
            placeholder="Montpellier, France"
            ref={this.autoCompleteRef}
          />
        </div>
        {/* <AutoCompleteInput map={this.map} search={this.search}/> */}
        <div className="mr-0 ml-0 pr-0 pl-0">
          <div className="row">
            <div className="col-10">
              <div id="map" ref={this.googleMapRef}></div>
            </div>
            <div className="col-2">
              <div id="listing">
                <table id="resultsTable">
                  <tbody id="results">
                    {this.state.markers.map((m, i: number) => {
                      const style =
                        i % 2 === 0
                          ? { backgroundColor: "#F0F0F0" }
                          : { backgroundColor: "#FFFFFF" };
                      return (
                        <tr key={i} className="mt-1 mb-1" style={style}>
                          <td key={i}>
                            <img
                              key={i}
                              className="marker"
                              src={marker}
                              alt="marker"
                            />
                          </td>
                          <td>{m.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
