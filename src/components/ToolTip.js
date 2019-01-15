import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ToolTip extends Component {
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
    const { title, score, comments, url, sub } = this.props.bubbleData;
    const { _months } = this;

    const date = new Date(this.props.bubbleData.date);
    const fdate = `${
      _months[date.getMonth()]
    }-${date.getDate()} ${date.getFullYear()}`;

    return (
      <div style={this.props.toolStyle} className={`tooltip visible`}>
        <div className="subname">r/{sub}</div>
        <div className="title">{title}</div>
        <hr />
        <table>
          <tbody>
            <tr>
              <td>date</td>
              <td>{fdate}</td>
            </tr>
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
  bubbleData: PropTypes.object.isRequired,
  toolStyle: PropTypes.object.isRequired
};
