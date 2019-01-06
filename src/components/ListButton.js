import React, { Component } from "react";

//does this need to extend class?
export default class ListButton extends Component {
  render() {
    return (
      <li
        className={this.props.isActive ? "active" : "notactive"}
        onClick={this.props.onSelect}
      >
        {this.props.children}
      </li>
    );
  }
}
