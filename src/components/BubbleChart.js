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
    // toolTop: "100px",
    // toolLeft: "0px",
    toolStyle: {
      position: "absolute",
      top: "100px",
      left: "0px",
      width: "300px"
    },
    selectedBubble: {
      title: "TITLE",
      date: 1547002543,
      comments: 100,
      url: "",
      score: 100,
      image: ""
    }
  };
  margin = {
    top: 15,
    left: 30,
    right: 30,
    bottom: 30
  };

  _minRad = 4;
  _maxRad = 28;
  _dur = 1000;
  _minHeight = 20;
  _minY = 100;
  _maxY = 1;
  _colors = [
    "#f00",
    "#00f",
    "#0f0",
    "#0ff",
    "#ff0",
    "#cc33ff",
    "#00ffff",
    "#006600"
  ];
  _colorPairs = {
    //dont like that colors are here but subs are in app.js
    politics: "#CCDBDC",
    worldnews: "#80CED7",
    the_donald: "#63C7B2",
    conservative: "#8E6C88",
    alltheleft: "#263D42",
    democrats: "#0B3948"
  };

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

    // this.legend = this.s
    //   .append("g")
    //   .attr("transform", `translate(${this.width / 2},${this.height - 100})`);

    // this.legend
    //   .append("text")
    //   .attr("x", 30)
    //   .attr("y", 10)
    //   .attr("text-anchor", "middle")
    //   .text("Legend");

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
      // width,
      _ballSize,
      _dur,
      _minRad,
      _maxRad,
      _minY,
      _maxY,
      _colors,
      _colorPairs
    } = this;
    const height = this.height - (margin.top + margin.bottom);
    const width = this.width - (margin.left + margin.right);

    if (
      this.props.bubbleData !== prevProps.bubbleData ||
      this.props.singleScale !== prevProps.singleScale
    ) {
      // this.s.selectAll("g").remove();

      this.g
        .selectAll("circle")
        .transition()
        .attr("r", 0)
        .duration(800)
        .remove();

      const subs = Object.keys(bubbleData);
      const propExtractor = (prop, selectedSub = "") =>
        selectedSub === ""
          ? subs
              .map(sub => bubbleData[sub].map(post => post[prop]))
              .reduce((acc, curr) => [...curr, ...acc])
              .sort((a, b) => (a < b ? -1 : 1))
          : bubbleData[selectedSub]
              .map(post => post[prop])
              .sort((a, b) => (a < b ? -1 : 1));

      //SHOULD I JUST TRANSFORM bubbleData to an array in App.js instead???

      const bubbleSet = subs
        .map(sub => bubbleData[sub])
        .reduce((acc, curr) => [...curr, ...acc]);

      const clickHandler = (d, i, g) => {
        const posX = g[i].getAttribute("cx") / width;
        const posY = g[i].getAttribute("cy") / height;
        // console.log(posY);
        // const {top, toolTop}= this.state.toolStyle;
        let left = this.state.toolStyle.left;
        let top = this.state.toolStyle.top;
        let w = this.state.toolStyle.width;

        if (posX > 0.66) {
          left = "0px";
          console.log("left");
        } else {
          if (posX < 0.33) {
            left = "400px";
            console.log("right");
          } else {
            console.log("CENTER");
            left = (width - parseInt(w.replace("px", ""))) / 2 + "px";
            // console.log(left);
            //middle
          }
        }
        console.log(left);

        select(g[i]).attr("stroke-width", 3);
        this.setState({
          showTooltip: true,
          selectedBubble: d,
          toolStyle: {
            ...this.state.toolStyle,
            left,
            top
          }
        });
      };

      if (this.props.singleScale) {
        const dates = propExtractor("date");
        const comments = propExtractor("comments");
        const scores = propExtractor("score");

        const xScale = scaleTime()
          .domain([dates[0], dates[dates.length - 1]])
          .range([0, width - (margin.left + margin.right)]);

        const yScale = scaleLinear()
          .domain([comments[0], comments[comments.length - 1]])
          .range([height * _maxY, _minY]);

        const rScale = scaleLinear()
          .domain([scores[0], scores[scores.length - 1]])
          .range([_minRad, _maxRad]);

        const xAxis = axisBottom(xScale)
          .ticks(timeMonths(dates[0], dates[dates.length - 1]).range)
          .tickSize(12, 0);

        this.s
          .append("g")
          .attr("class", "xaxis")
          .style("font-family", "mainfont")
          .attr(
            "transform",
            "translate(" + margin.left + "," + (this.height - 20) + ")"
          )
          .call(xAxis);

        this.g
          .selectAll("bubbles")
          .data(bubbleSet)
          .enter()
          .append("circle")
          .attr("class", d => `bubble group-${subs.indexOf(d.sub)}`)
          .attr("r", 0)
          .attr("cx", d => xScale(new Date(d.date)))
          .attr("cy", height)
          .attr("fill", d => _colorPairs[d.sub])
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .on("click", clickHandler)
          .on("mouseleave", function(d, i, g) {
            select(g[i]).attr("stroke-width", 1);
            // par.setState({ showTooltip: false });
          })
          .transition()
          .attr("r", d => rScale(d.score))
          .attr("cy", d => yScale(d.comments))
          .duration(_dur);
      } else {
        //MULTI SCALE
        const scales = subs.map(s => {
          const dates = propExtractor("date", s).map(d => {
            return new Date(d);
          });
          const comments = propExtractor("comments", s);
          const scores = propExtractor("score", s);

          const xScale = scaleTime()
            .domain([dates[0], dates[dates.length - 1]])
            .range([0, width - (margin.left + margin.right)]);

          const yScale = scaleLinear()
            .domain([comments[0], comments[comments.length - 1]])
            .range([height * _maxY, _minY]);

          const rScale = scaleLinear()
            .domain([scores[0], scores[scores.length - 1]])
            .range([_minRad, _maxRad]);

          return { sub: s, xScale, yScale, rScale };
        });

        this.g
          .selectAll("bubbles")
          .data(bubbleSet)
          .enter()
          .append("circle")
          // .attr("class", d => `bubble group-${subs.indexOf(d.sub)}`)
          .attr("r", 0)
          .attr("cx", d => {
            const date = new Date(d.date);
            // console.log(d, scales.find(s => s.sub === d.sub));
            return scales.find(s => s.sub === d.sub).xScale(date);
          })
          .attr("cy", height)
          .attr("fill", d => _colorPairs[d.sub])
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .on("click", clickHandler)
          .on("mouseleave", function(d, i, g) {
            select(g[i]).attr("stroke-width", 1);
            // par.setState({ showTooltip: false });
          })
          .transition()
          .attr("r", d => {
            // console.log(d.score, scales.find(s => s.sub === d.sub).rScale(d.score) )
            return scales.find(s => s.sub === d.sub).rScale(d.score);
          })
          .attr("cy", d => scales.find(s => s.sub === d.sub).yScale(d.comments))
          .duration(_dur);
      }

      // this.legend
      //   .append("circle")
      //   .attr("class", "legend-bubble")
      //   .attr("r", rScale(scores[scores.length - 1]))
      //   .attr("stroke", "#808080")
      //   .attr("fill", "#f0f")
      //   // .attr("stroke-dasharray", 4)
      //   .attr("cx", 30)
      //   .attr("cy", 70);

      // this.legend
      //   .append("circle")
      //   .attr("class", "legend-bubble")
      //   .attr("r", rScale(scores[0]))
      //   .attr("stroke", "#808080")
      //   .attr("fill", "#f0f")
      //   // .attr("stroke-dasharray", 4)
      //   .attr("cx", 130)
      //   .attr("cy", 70);

      // // const hiScore = scores[scores.length - 1] / 1000;

      // this.legend
      //   .append("text")
      //   .attr("x", 28)
      //   .attr("y", 33)
      //   .attr("text-anchor", "middle")
      //   .text(`${Math.round(scores[scores.length - 1] / 1000)}k`);

      // this.legend
      //   .append("text")
      //   .attr("x", 128)
      //   .attr("y", 52)
      //   .attr("text-anchor", "middle")
      //   .text(`${Math.round(scores[0] / 1000)}k`);
    }
  }

  render() {
    const { selectedBubble } = this.state;
    const { bubbleData } = this.props;
    console.log(bubbleData)

    return (
      <div className="svg-container" ref={ref => (this.ref = ref)}>
        <svg />
        {this.state.showTooltip && (
          <ToolTip
            bubbleData={this.state.selectedBubble}
            toolStyle={this.state.toolStyle}
          />
        )}
      </div>
    );
  }
}

BubbleChart.propTypes = {
  bubbleData: PropTypes.object.isRequired,
  selectedBubble: PropTypes.string.isRequired,
  singleScale: PropTypes.bool.isRequired
};
