import React, { Component } from "react";

import SelectableList from "./components/SelectableList";
import ListButton from "./components/ListButton";
// import { select, selectAll } from "d3-selection";
// import ReactD3Wrapper from "./ReactD3Wrapper";
import axios from "axios";
import BubbleChart from "./components/BubbleChart";

class App extends Component {
  _initPosts = {
    politics: [],
    worldnews: [],
    the_donald: [],
    conservative: [],
    alltheleft: [],
    democrats: []
  };

  state = {
    postCount: 50,
    timePeriod: "month",
    lastPostCount: 0,
    showSpinner: true,
    posts: this._initPosts,
    selectedBubble: "",
    selectedSubs: Object.keys(this._initPosts),
    selectedScale: "one per sub"
  };

  componentDidMount() {
    this.callAPI();
  }

  callAPI() {
    this.setState({ showSpinner: true, posts: this._initPosts });

    let d = Object.keys(this.state.posts).map(s => {
      return axios
        .get(
          "http://rockthecatzva.com/reddit-apibounce-php/public/posts/top/" +
            s +
            "/" +
            this.state.timePeriod +
            "/" +
            this.state.postCount
        )
        .then(resp => {
          return resp.data.map(ob => {
            return {
              url: ob.data["url"],
              score: ob.data["score"],
              ups: ob.data["ups"],
              date: ob.data["created_utc"] * 1000,
              downs: ob.data["downs"],
              title: ob.data["title"],
              domain: ob.data["domain"],
              image: ob.data["thumbnail"],
              comments: ob.data["num_comments"],
              sub: s
            };
          });
        })
        .catch(err => {
          console.log("errror");
        });
    });

    Promise.all(d).then(f => {
      const labels = f.map(s => s[0].sub);

      const posts = [...f].reduce((acc, curr, i) => {
        return { [labels[i]]: curr, ...acc };
      }, {});
      this.setState({
        posts,
        lastPostCount: this.state.postCount,
        showSpinner: false
      });
    });
  }

  onTimeSelect = timePeriod => {
    this.setState({ timePeriod }, () => this.callAPI());
  };

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Top Reddit Posts for [{this.state.timePeriod}] by Sub*
        </h1>
        <div className="main">
          <p className="methodology">
            * A submission's score is simply the number of upvotes minus the
            number of downvotes. If five users like the submission and three
            users don't it will have a score of 2." via reddit's faq
          </p>
          <div className="option-body">
            <div className="instruct">1. Select a timeperiod.</div>
            <SelectableList
              activeIndex={this.state.timePeriod}
              onSelect={timePeriod => this.onTimeSelect(timePeriod)}
            >
              <ListButton>day</ListButton>
              <ListButton>week</ListButton>
              <ListButton>month</ListButton>
              <ListButton>year</ListButton>
              <ListButton>all</ListButton>
            </SelectableList>

            <div className="instruct clear">Selected subs:</div>

            <SelectableList
              activeIndex={this.state.selectedSubs}
              onSelect={timePeriod => {
                if (this.state.selectedSubs.indexOf(timePeriod) >= 0) {
                  const selectedSubs = this.state.selectedSubs.filter(
                    s => s !== timePeriod
                  );
                  this.setState({
                    selectedSubs
                  });
                } else {
                  this.setState({
                    selectedSubs: [timePeriod, ...this.state.selectedSubs]
                  });
                }
              }}
            >
              <ListButton>politics</ListButton>
              <ListButton>worldnews</ListButton>
              <ListButton>the_donald</ListButton>
              <ListButton>conservative</ListButton>
              <ListButton>alltheleft</ListButton>
              <ListButton>democrats</ListButton>
            </SelectableList>

            <div className="instruct clear">Scale:</div>
            <SelectableList
              activeIndex={this.state.selectedScale}
              onSelect={scale => {
                if (scale !== this.state.selectedScale) {
                  this.setState({ selectedScale: scale });
                }
              }}
            >
              <ListButton>single </ListButton>
              <ListButton>one per sub</ListButton>
            </SelectableList>
          </div>
        </div>
        <div className="viz-container clear">
          <div className="sub">
            <BubbleChart
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts}
            />
            {this.state.showSpinner && (
              <div className="spinner">
                <div />
                <div />
                <div />
                <div />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
