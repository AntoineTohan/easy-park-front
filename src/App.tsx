import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MapWrapper from "./components/MapWrapper";

export default class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="App">
        <Navbar />
        <MapWrapper />
        <Footer />
      </div>
    );
  }
}
