import React from "react";
import axios from "axios";
import { correspondance } from "../../correspondanceParkings";
import InfoPanel from "./infoPanel/InfoPanel";
import "./MapWrapper.css";

export interface IMapMarker {
  marker: google.maps.Marker;
  result: google.maps.places.PlaceResult;
  parking: IParking[] | undefined;
}

export interface IParking {
  id: string;
  name: string;
  open: boolean;
  free: number;
  total: number;
}

interface IState {
  mapMarkers: IMapMarker[];
  vicinityOrigin: string | undefined;
  originMaker: google.maps.Marker | undefined;
  destinationMaker: google.maps.Marker | undefined;
  parkings: IParking[];
}

export default class MapWrapper extends React.PureComponent<{}, IState> {
  private googleMapRef = React.createRef<HTMLDivElement>();
  private autoCompleteDestinationRef = React.createRef<HTMLInputElement>();
  private autoCompleteOriginRef = React.createRef<HTMLInputElement>();
  private autocompleteDestination: google.maps.places.Autocomplete | null = null;
  private autocompleteOrigin: google.maps.places.Autocomplete | null = null;
  private map: google.maps.Map<HTMLDivElement> | null = null;
  private places: google.maps.places.PlacesService | null = null;
  private infoWindow: google.maps.InfoWindow | null = null;
  constructor() {
    super({});
    this.state = {
      mapMarkers: [],
      originMaker: undefined,
      destinationMaker: undefined,
      vicinityOrigin: undefined,
      parkings: [],
    };
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.createMarkerOrigin = this.createMarkerOrigin.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    window.document.body.appendChild(script);

    axios.get("http://localhost:8080").then((res) => {
      const parkings = res.data;
      this.setState({ parkings });
    });

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
        if (
          this.autoCompleteDestinationRef.current &&
          this.autoCompleteOriginRef.current
        ) {
          this.autocompleteDestination = new window.google.maps.places.Autocomplete(
            this.autoCompleteDestinationRef.current,
            {
              types: [],
              componentRestrictions: { country: "fr" },
            }
          );

          this.autocompleteOrigin = new window.google.maps.places.Autocomplete(
            this.autoCompleteOriginRef.current,
            {
              types: [],
              componentRestrictions: { country: "fr" },
            }
          );
          this.autocompleteDestination.addListener(
            "place_changed",
            this.onPlaceChanged
          );
          this.autocompleteOrigin.addListener(
            "place_changed",
            this.createMarkerOrigin
          );
          this.places = new window.google.maps.places.PlacesService(this.map);
        }
        setInterval(
          () =>
            axios.get("http://localhost:8080").then((res) => {
              const parkings = res.data;
              this.setState({ parkings });
            }),
          1000
        );
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
  private clearOriginMarker() {
    if (this.state.originMaker) this.state.originMaker.setMap(null);
    this.setState({ originMaker: undefined });
  }
  private clearDestinationMarker() {
    if (this.state.destinationMaker) this.state.destinationMaker.setMap(null);
    this.setState({ destinationMaker: undefined });
  }
  private changeMarkerStyle(
    marker: google.maps.Marker,
    Zindex: number,
    url?: string
  ) {
    marker.setZIndex(Zindex);
    if (url) {
      marker.setIcon(url);
    }
  }

  private createMarkerDestination() {
    this.clearDestinationMarker();
    const place = this.autocompleteDestination!.getPlace();
    if (place) {
      const destinationMarker = new window.google.maps.Marker({
        position: place.geometry!.location,
        animation: window.google.maps.Animation.DROP,
        map: this.map ? this.map : undefined,
        icon: "http://maps.gstatic.com/mapfiles/markers2/marker_greenD.png",
      });
      this.changeMarkerStyle(destinationMarker, 21);
      window.google.maps.event.addListener(
        destinationMarker,
        "mouseover",
        () => {
          this.changeMarkerStyle(destinationMarker, 20);
        }
      );
      window.google.maps.event.addListener(
        destinationMarker,
        "mouseout",
        () => {
          this.changeMarkerStyle(destinationMarker, 10);
        }
      );
      this.setState({ destinationMaker: destinationMarker });
    }
  }

  private createMarkerOrigin() {
    this.clearOriginMarker();
    if (this.autocompleteOrigin && this.map) {
      const placeOrigin = this.autocompleteOrigin.getPlace();
      if (placeOrigin && placeOrigin.geometry) {
        this.map.panTo(placeOrigin.geometry.location);
        this.map.setZoom(15);
        const originMarker = new window.google.maps.Marker({
          position: placeOrigin.geometry!.location,
          animation: window.google.maps.Animation.DROP,
          map: this.map ? this.map : undefined,
          icon: "http://maps.gstatic.com/mapfiles/markers2/marker_greenO.png",
        });
        this.changeMarkerStyle(originMarker, 20);
        window.google.maps.event.addListener(originMarker, "mouseover", () => {
          this.changeMarkerStyle(originMarker, 20);
        });
        window.google.maps.event.addListener(originMarker, "mouseout", () => {
          this.changeMarkerStyle(originMarker, 10);
        });
        this.setState({ vicinityOrigin: placeOrigin.formatted_address });
        this.setState({ originMaker: originMarker });
      }
    }
  }

  private addParkingMarkerEvent(m: IMapMarker) {
    window.google.maps.event.addListener(m.marker, "click", () =>
      this.showInfoWindow(m)
    );
    window.google.maps.event.addListener(m.marker, "mouseover", () => {
      this.changeMarkerStyle(
        m.marker,
        18,
        "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png"
      );
    });
    window.google.maps.event.addListener(m.marker, "mouseout", () => {
      this.changeMarkerStyle(
        m.marker,
        10,
        "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png"
      );
    });
  }

  private getCorrespondanceParking(r: google.maps.places.PlaceResult) {
    const result = correspondance.parkings.filter((p) => {
      if (p.googleName === r.name) {
        return p;
      }
    });
    if (result.length > 0) {
      const parkingObject = this.state.parkings.filter((p) => {
        if (p.name === result[0].name) {
          return p;
        }
      });
      return parkingObject;
    }
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
            this.createMarkerDestination();
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
                  parking: this.getCorrespondanceParking(r),
                };
              }
            );
            mapMarkers.map((m: IMapMarker) => this.addParkingMarkerEvent(m));
            this.setState({ mapMarkers: mapMarkers });
          }
        }
      );
    }
  }

  private showInfoWindow(mapMarker: IMapMarker) {
    if (this.places) {
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
    if (this.autocompleteDestination && this.map) {
      const place = this.autocompleteDestination.getPlace();
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
      <div className="container-flui mb-5">
        <div className="form-group">
          <label>
            <b>D'où partez-vous ?</b> :
          </label>
          <input
            className="form-control mb-3 ml-3"
            id="inputAutoComplete"
            type="text"
            placeholder="Saint-Gély-du-Fesc, France"
            ref={this.autoCompleteOriginRef}
          />
        </div>
        <div className="form-group">
          <label>
            <b>Entrez votre destination</b> ( Easy'Park trouvera les parkings
            les plus proches à votre place ) :
          </label>
          <input
            className="form-control mb-3 ml-3"
            id="inputAutoComplete"
            type="text"
            placeholder="20 Rue d'Alco, Montpellier, France"
            ref={this.autoCompleteDestinationRef}
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
              <InfoPanel
                markers={this.state.mapMarkers}
                vicinityOrigin={this.state.vicinityOrigin!}
                infoWindow={this.infoWindow}
                map={this.map!}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
