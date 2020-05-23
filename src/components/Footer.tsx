import React from "react";
import Emoji from "react-emoji-render";

export default class Footer extends React.PureComponent<{}, {}> {
  render() {
    return (
      <nav className="navbar fixed-bottom navbar-light bg-light">
        <p className="text-center w-100">
          <Emoji text="Made with ❤️ by an EPSI team" />
        </p>
      </nav>
    );
  }
}
