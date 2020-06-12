import React from "react";
import Emoji from "react-emoji-render";

export default class Footer extends React.PureComponent<{}, {}> {
  render() {
    return (
      <nav className="navbar relative-bottom navbar-light bg-light">
        <div className="text-center w-100">
          <div>© 2019-2020 Easy'Park,</div>
          <Emoji text="Made with ❤️ by dev team" />
        </div>
      </nav>
    );
  }
}
