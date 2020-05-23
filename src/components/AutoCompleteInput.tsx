import React from "react";

interface IPropsAutoCompleteInput {
  map: google.maps.Map<HTMLDivElement> | null;
  search(): void;
  script: HTMLScriptElement;
}

export default class AutoCompleteInput extends React.PureComponent<
  IPropsAutoCompleteInput,
  {}
> {
  private autoCompleteRef = React.createRef<HTMLInputElement>();
  private autocomplete: google.maps.places.Autocomplete | null = null;
  constructor(props: IPropsAutoCompleteInput) {
    super(props);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  componentDidMount() {
    this.props.script.addEventListener("load", () => {
      if (this.autoCompleteRef.current) {
        this.autocomplete = new window.google.maps.places.Autocomplete(
          this.autoCompleteRef.current,
          {
            types: ["(regions)"],
            componentRestrictions: { country: "fr" },
          }
        );
        this.autocomplete.addListener("place_changed", this.onPlaceChanged);
      }
    });
  }

  private onPlaceChanged() {
    if (this.autocomplete && this.props.map) {
      const place = this.autocomplete.getPlace();
      this.props.map.panTo(place.geometry!.location);
      this.props.map.setZoom(12);
      this.props.search();
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
      </div>
    );
  }
}
