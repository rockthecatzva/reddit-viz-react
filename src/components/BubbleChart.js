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

    if (this.props.bubbleData !== prevProps.bubbleData) {
      // this.s.selectAll("g").remove();

      this.g
        .selectAll("circle")
        .transition()
        .attr("r", 0)
        .duration(800)
        .remove();

      const subs = Object.keys(bubbleData);
      const propExtractor = prop =>
        subs
          .map(sub => bubbleData[sub].map(post => post[prop]))
          .reduce((acc, curr) => [...curr, ...acc])
          .sort((a, b) => (a < b ? -1 : 1));
      const dates = propExtractor("date");
      const comments = propExtractor("comments");
      const scores = propExtractor("score");

      //SHOULD I JUST TRANSFORM bubbleData to an array in App.js instead???

      const bubbleSet = subs
        .map(sub => bubbleData[sub])
        .reduce((acc, curr) => [...curr, ...acc]);

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

      this.s
        .append("g")
        .attr("class", "xaxis")
        .style("font-family", "mainfont")
        .attr("transform", "translate("+(margin.left)+"," + (this.height-20) + ")")
        .call(axis);

      const par = this;

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
        .on("mouseenter", function(d, i, g) {
          const posX = g[i].getAttribute("cx") / width;
          const posY = g[i].getAttribute("cy") / height;
          console.log(posY);
          let left;
          if (posX > 0.66) {
            // left = "0px";
            console.log("left");
          } else {
            if (posX < 0.33) {
              // left = "400px";
              console.log("right");
            } else {
              console.log("CENTER");
              // left =
              //   (width -
              //     parseInt(par.state.toolStyle.width.replace("px", ""))) /
              //     2 +
              //   "px";
              console.log(left);
              //middle
            }
          }

          select(g[i]).attr("stroke-width", 3);
          par.setState({
            showTooltip: true,
            selectedBubble: d,
            // toolStyle: {
            //   ...par.state.toolStyle,
            //   left
            // }
          });
        })
        .on("mouseleave", function(d, i, g) {
          select(g[i]).attr("stroke-width", 1);
          par.setState({ showTooltip: false });
        })
        .transition()
        .attr("r", d => rScale(d.score))
        .attr("cy", d => yScale(d.comments))
        .duration(_dur);
    }
  }

  

  render() {
    const { selectedBubble } = this.state;
    const { bubbleData } = this.props;
    

    
    // const sub = bubbleData.length > 0 ? bubbleData[0].sub : "loading...";

    return (
      <div className="svg-container" ref={ref => (this.ref = ref)}>
        <svg />
        <ToolTip 
         url={this.state.selectedBubble.url}
         comments={this.state.selectedBubble.comments}
         score={this.state.selectedBubble.score}
         title={this.state.selectedBubble.title}
         sub={this.state.selectedBubble.sub}
         date={this.state.selectedBubble.date}
         />
      </div>
    );
  }
}

BubbleChart.propTypes = {
  bubbleData: PropTypes.object.isRequired,
  clickHandler: PropTypes.func.isRequired,
  selectedBubble: PropTypes.string.isRequired
};
