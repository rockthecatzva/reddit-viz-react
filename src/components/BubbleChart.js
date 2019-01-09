import React, { Component } from "react";
import PropTypes from "prop-types";
import ToolTip from "./ToolTip";
import { select, selectAll } from "d3-selection";
import { axisBottom as d3AxisBottom } from "d3-axis";
import { scaleLinear, scaleSequential } from "d3-scale";
import { transition } from "d3-transition";
import {interpolateBlues} from "d3"

export default class BubbleChart extends Component {
  margin = {
    top: 15,
    left: 15,
    right: 15,
    bottom: 15
  };

  _ballSize = 4;
  _dur = 1000;
  _minHeight = 20;

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
  }

  componentDidUpdate(prevProps) {
    const { bubbleData } = this.props;
    const { margin, width, _ballSize, _dur, _minHeight } = this;
    const height = this.height - (margin.top + margin.bottom);

    if (this.props.bubbleData !== prevProps.bubbleData) {
      // this.s.selectAll("g").remove();

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

      const colorScale = scaleSequential(interpolateBlues)
        .domain([comments[0], comments[comments.length-1]])

      const xScale = scaleLinear()
        .domain([dates[0], dates[dates.length - 1]])
        .range([0, width - (margin.left + margin.right)]);

      const yScale = scaleLinear()
        .domain([scores[0], scores[scores.length - 1]])
        .range([_minHeight, height - (margin.top + margin.bottom)]);

      this.g
        .selectAll("bars")
        .data(bubbleData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(new Date(d.date)) - _ballSize)
        .attr("y", height)
        .attr("width", _ballSize * 2)
        .attr("height", 0)
        .attr("fill", d=>colorScale(d.comments))
        .transition()
        .duration(_dur)
        .attr("y", d => height - yScale(d.score))
        .attr("height", d => yScale(d.score));

      this.g
        .selectAll("bubbles")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("r", _ballSize)
        .attr("cx", d => xScale(new Date(d.date)))
        .attr("cy", height)
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .on("mouseenter", function(d, i, g) {
          console.log(d, g[i]);
          select(g[i])
            .attr("r", _ballSize + 3)
            .attr("stroke-width", 3);
          // this.attr("r", _ballSize+3)
        })
        .on("mouseleave", function(d, i, g) {
          select(g[i])
            .attr("r", _ballSize)
            .attr("stroke-width", 1);
        })
        .transition()
        .duration(_dur)
        .attr("cy", d => height - yScale(d.score))
        .attr("class", "bubble");
    }
  }

  render() {
    const {
      width,
      height,
      bubbleData,
      labels,
      clickHandler,
      selectedBubble
    } = this.props;

    return (
      <div ref={ref => (this.ref = ref)}>
        <svg className="svg-container" />
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
