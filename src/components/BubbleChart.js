import React, { Component } from "react";
import PropTypes from "prop-types";
import ToolTip from "./ToolTip";
import { select, selectAll } from "d3-selection";
import { axisBottom } from "d3-axis";
import { scaleLinear, scaleSequential, scaleTime } from "d3-scale";
import { transition } from "d3-transition";
import { interpolateBlues } from "d3";
import { timeMonths } from "d3-time";

export default class BubbleChart extends Component {
  state = {
    showTooltip: false,
    selectedBubble: {
      title: "TITLE",
      date: 1547002543,
      comments: 100,
      url: "",
      score: 100,
      image: ""
    },
    toolStyle: {
      position: "absolute",
      top: "200px",
      left: "0px"
    }
  };
  margin = {
    top: 15,
    left: 30,
    right: 120,
    bottom: 15
  };

  _minRad = 4;
  _maxRad = 28;
  _dur = 1000;
  _minHeight = 20;
  _minY = 100;
  _maxY = 0.8;
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

  componentDidMount() {
    this.s = select(this.ref).select("svg");

    this.g = this.s
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    this.width = parseInt(this.s.style("width").replace("px", ""));
    this.height = parseInt(this.s.style("height").replace("px", ""));

    this.legend = this.s
      .append("g")
      .attr("transform", `translate(${this.width - 100},${0})`);
    
      this.legend
      .append("text")
      .attr("x", 30)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text("Legend");

    // this.legend
    //   .append("line")
    //   .attr("x1", 10)
    //   .attr("y1", 14)
    //   .attr("x2", 118)
    //   .attr("y2", 14)
    //   .attr("stroke", "#000");
  }

  componentDidUpdate(prevProps) {
    const { bubbleData } = this.props;
    const {
      margin,
      width,
      _ballSize,
      _dur,
      _minRad,
      _maxRad,
      _minY,
      _maxY
    } = this;
    const height = this.height - (margin.top + margin.bottom);

    if (this.props.bubbleData !== prevProps.bubbleData) {
      // this.s.selectAll("g").remove();

      if (this.props.bubbleData.length < 1) {
        this.g
          .selectAll("circle")
          .transition()
          .attr("r", 0)
          .duration(800)
          .remove();
      }

      const dates = bubbleData
        .map(b => {
          // console.log(b);
          return new Date(b.date);
        })
        .sort((a, b) => {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        });

      const comments = bubbleData
        .map(b => b.comments)
        .sort((a, b) => (a < b ? -1 : 1));

      const scores = bubbleData
        .map(b => b.score)
        .sort((a, b) => (a < b ? -1 : 1));

      const colorScale = scaleSequential(interpolateBlues).domain([
        comments[0],
        comments[comments.length - 1]
      ]);

      const xScale = scaleTime()
        .domain([dates[0], dates[dates.length - 1]])
        .range([0, width - (margin.left + margin.right)]);

      const yScale = scaleLinear()
        .domain([comments[0], comments[comments.length - 1]])
        .range([height * _maxY, _minY]);

      const rScale = scaleLinear()
        .domain([scores[0], scores[scores.length - 1]])
        .range([_minRad, _maxRad]);

      const axis = axisBottom(xScale)
        .ticks(timeMonths(dates[0], dates[dates.length - 1]).range)
        .tickSize(12, 0);

      this.legend
        .append("circle")
        .attr("class", "legend-bubble")
        .attr("r", rScale(scores[scores.length - 1]))
        .attr("stroke", "#808080")
        .attr("fill", "#f0f")
        // .attr("stroke-dasharray", 4)
        .attr("cx", 30)
        .attr("cy", 50);

      this.legend
        .append("circle")
        .attr("class", "legend-bubble")
        .attr("r", rScale(scores[0]))
        .attr("stroke", "#808080")
        .attr("fill", "#f0f")
        // .attr("stroke-dasharray", 4)
        .attr("cx", 30)
        .attr("cy", 120);

      const hiScore = scores[scores.length - 1] / 1000;

      this.legend
        .append("text")
        .attr("x", 28)
        .attr("y", 33)
        .attr("text-anchor", "middle")
        .text(`${Math.round(scores[scores.length - 1] / 1000)}k`);

      this.legend
        .append("text")
        .attr("x", 128)
        .attr("y", 52)
        .attr("text-anchor", "middle")
        .text(`${Math.round(scores[0] / 1000)}k`);

      this.g
        .append("g")
        .attr("class", "xaxis")
        .style("font-family", "mainfont")
        .attr("transform", "translate(0," + (height - 20) + ")")
        .call(axis);

      const par = this;

      this.g
        .selectAll("bubbles")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", 0)
        .attr("cx", d => xScale(new Date(d.date)))
        .attr("cy", height)
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .on("mouseenter", function(d, i, g) {
          console.log(d);
          select(g[i]).attr("stroke-width", 3);
          par.setState({
            showTooltip: true,
            selectedBubble: d,
            toolStyle: {
              ...par.state.toolStyle,
              left: g[i].getAttribute("cx") + "px"
            }
          });
        })
        .on("mouseleave", function(d, i, g) {
          select(g[i]).attr("stroke-width", 1);
          // par.setState({ showTooltip: false });
        })
        .transition()
        .attr("r", d => rScale(d.score))
        .attr("cy", d => yScale(d.comments))
        .duration(_dur);
    }
  }

  numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }

  render() {
    const { selectedBubble } = this.state;
    const { bubbleData } = this.props;
    const { _months } = this;

    const date = new Date(selectedBubble.date);
    const fdate = `${
      _months[date.getMonth()]
    }-${date.getDate()} ${date.getFullYear()}`;
    const sub = bubbleData.length > 0 ? bubbleData[0].sub : "loading...";

    return (
      <div className="svg-container" ref={ref => (this.ref = ref)}>
        <svg />
        <h3 className="sub-name">r/{sub}</h3>
        {this.state.showTooltip && (
          <div style={this.state.toolStyle} className="tooltip">
            <div className="title">{selectedBubble.title}</div>
            <hr />
            <div>{fdate}</div>
            <table>
              <tbody>
                <tr>
                  <td>score</td>
                  <td>{this.numberWithCommas(selectedBubble.score)}</td>
                </tr>
                <tr>
                  <td>comments</td>
                  <td>{this.numberWithCommas(selectedBubble.comments)}</td>
                </tr>
              </tbody>
            </table>
            {/* <img src={selectedBubble.image} /> */}
            <div />
            <a target="_blank" href={selectedBubble.url}>Link</a>
          </div>
        )}
      </div>
    );
  }
}

BubbleChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  bubbleData: PropTypes.array.isRequired,
  clickHandler: PropTypes.func.isRequired,
  selectedBubble: PropTypes.string.isRequired
};
