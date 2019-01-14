import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ToolTip extends Component {
  state = {
    toolStyle: {
      position: "absolute",
      top: "200px",
      width: "300px",
      left: "0px"
    }
  };

  _months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ];

  numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }

  render() {
    const { title, score, comments, url, sub } = this.props;
    const { _months } = this;

    const date = new Date(this.props.date);
    const fdate = `${
      _months[date.getMonth()]
    }-${date.getDate()} ${date.getFullYear()}`;

    return (
      <div
        style={this.state.toolStyle}
        className={`tooltip ${
          this.state.showTooltip === true ? "visible" : "hidden"
        }`}
      >
        <div className="subname">r/{sub}</div>
        <div className="title">{title}</div>
        <hr />
        <div>{fdate}</div>
        <table>
          <tbody>
            <tr>
              <td>score</td>
              <td>{this.numberWithCommas(score)}</td>
            </tr>
            <tr>
              <td>comments</td>
              <td>{this.numberWithCommas(comments)}</td>
            </tr>
          </tbody>
        </table>
        {/* <img src={selectedBubble.image} /> */}
        <div />
        <a target="_blank" href={url}>
          Link
        </a>
      </div>
    );
  }
}

ToolTip.propTypes = {
  url: PropTypes.string.isRequired,
  comments: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  sub: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired
};
