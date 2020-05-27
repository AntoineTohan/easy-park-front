import React from "react";
// import AutoCompleteInput from "./AutoCompleteInput";
import InfoList from "./infoList/InfoList";
import "./MapWrapper.css";

export interface IMapMarker {
  marker: google.maps.Marker;
  result: google.maps.places.PlaceResult;
}

interface IState {
  mapMarkers: IMapMarker[];
}

export default class MapWrapper extends React.PureComponent<{}, IState> {
  private googleMapRef = React.createRef<HTMLDivElement>();
  private autoCompleteRef = React.createRef<HTMLInputElement>();
  private autocomplete: google.maps.places.Autocomplete | null = null;
  private map: google.maps.Map<HTMLDivElement> | null = null;
  private places: google.maps.places.PlacesService | null = null;
  private infoWindow: google.maps.InfoWindow | null = null;
  constructor() {
    super({});
    this.state = {
      mapMarkers: [],
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
        this.infoWindow = new google.maps.InfoWindow({
          content: "",
          maxWidth: 200,
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

  private clearMapMarkers() {
    this.state.mapMarkers.map((r: IMapMarker) => {
      return r.marker.setMap(null);
    });
    this.setState({ mapMarkers: [] });
  }

  private changeMarkerStyle(
    marker: google.maps.Marker,
    Zindex: number,
    url: string
  ) {
    marker.setZIndex(Zindex);
    marker.setIcon(url);
  }

  private search() {
    if (this.map && this.places) {
      this.clearMapMarkers();
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
            const markers = this.filterByType(results);
            const mapMarkers = markers.map(
              (r: google.maps.places.PlaceResult, i: number) => {
                return {
                  marker: new window.google.maps.Marker({
                    position: r.geometry ? r.geometry.location : undefined,
                    animation: window.google.maps.Animation.DROP,
                    map: this.map ? this.map : undefined,
                    icon:
                      "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png",
                  }),
                  result: r,
                };
              }
            );

            mapMarkers.map((m: IMapMarker) => {
              window.google.maps.event.addListener(m.marker, "click", () =>
                this.showInfoWindow(m)
              );

              window.google.maps.event.addListener(
                m.marker,
                "mouseover",
                () => {
                  this.changeMarkerStyle(
                    m.marker,
                    20,
                    "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png"
                  );
                }
              );
              window.google.maps.event.addListener(m.marker, "mouseout", () => {
                this.changeMarkerStyle(
                  m.marker,
                  10,
                  "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png"
                );
              });
            });
            this.setState({ mapMarkers: mapMarkers });
          }
        }
      );
    }
  }

  private showInfoWindow(mapMarker: IMapMarker) {
    if (this.places) {
      console.log(this.places);
      this.places.getDetails(
        { placeId: mapMarker.result.place_id! },
        (place, status) => {
          if (this.infoWindow && this.map) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              return;
            }
            const htmlString = `<div class="infoText">${mapMarker.result.name}</div>`;
            this.infoWindow.setContent(htmlString);
            this.infoWindow.open(this.map, mapMarker.marker);
          }
        }
      );
    }
  }

  private onPlaceChanged() {
    if (this.autocomplete && this.map) {
      const place = this.autocomplete.getPlace();
      if (place) {
        if (place.geometry) {
          this.map.panTo(place.geometry.location);
        }
        this.map.setZoom(13);
        this.search();
      }
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
        <div className="mr-0 ml-0 pl-0">
          <div className="row">
            <div className="col-sm-4 col-lg-10 resp-pl-0">
              <div
                id="map"
                className="map-responsive"
                ref={this.googleMapRef}
              ></div>
            </div>
            {this.infoWindow && (
              <InfoList
                markers={this.state.mapMarkers}
                infoWindow={this.infoWindow}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
