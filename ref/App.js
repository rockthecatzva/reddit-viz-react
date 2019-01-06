import React, { Component } from "react";
import "./App.css";
import BubbleChart from "./components/BubbleChart";

const axios = require("axios");
const Rx = require("rxjs");

class App extends Component {
  constructor(props) {
    super(props);
    this.callAPI = this.callAPI.bind(this);
    this.bubbleClick = this.bubbleClick.bind(this);

    this.state = {
      postCount: 5,
      timePeriod: "year",
      lastPostCount: 0,
      showUpdateButton: false,
      posts: [],
      selectedBubble: "",
      subs: [
        "politics",
        "worldnews",
        "gaming",
        "movies",
        "technology",
        "science"
      ]
    };
  }

  callAPI() {
    let d = this.state.subs.map(s => {
      return axios
        .get(
          "http://rockthecatzva.com/reddit-apibounce-php/public/" +
            s +
            "/" +
            this.state.timePeriod +
            "/" +
            this.state.postCount
        )
        .then(resp => {
          //console.log(resp.data);
          return resp.data.map(ob => {
            return {
              url: ob.data["url"],
              score: ob.data["score"],
              ups: ob.data["ups"],
              date: ob.data["created_utc"] * 1000,
              downs: ob.data["downs"],
              title: ob.data["title"],
              domain: ob.data["domain"],
              image: ob.data.hasOwnProperty("preview")
                ? ob.data.preview.images[0].source.url
                : null,
              comments: ob.data["num_comments"],
              sub: s
            };
          });
        })
        .catch(err => {
          console.log("error");
        });
    });

    Promise.all(d).then(f => {
      console.log("done");
      const postArray = f.reduce((acc, curr) => [...curr, ...acc]);
      this.setState({ posts: postArray, lastPostCount: this.state.postCount });
    });
  }

  componentDidMount() {
    console.log("Mounted");
    this.callAPI();

    this.timeSelect = Rx.Observable.fromEvent(
      document.querySelectorAll(".timeselect"),
      "click"
    )
      .map(event => event.target.innerHTML)
      .subscribe(value => {
        this.setState(
          Object.assign(this.state, { timePeriod: value.toLowerCase() }),
          this.callAPI
        );
      });

    this.incrementButton = Rx.Observable.fromEvent(
      document.querySelector("#increment"),
      "click"
    ).subscribe(value => {
      this.setState(
        Object.assign(this.state, {
          postCount: this.state.postCount + 1,
          showUpdateButton: true
        })
      );
    });

    this.decrementButton = Rx.Observable.fromEvent(
      document.querySelector("#decrement"),
      "click"
    ).subscribe(value => {
      this.setState(
        Object.assign(this.state, {
          postCount:
            this.state.postCount - 1 > 0 ? this.state.postCount - 1 : 0,
          showUpdateButton: true
        })
      );
    });
  }

  componentWillUnmount() {
    this.timeSelect.unsubscribe();
    this.incrementButton.unsubscribe();
    this.decrementButton.unsubscribe();
  }

  bubbleClick = d => {
    this.setState({ selectedBubble: d.title });
  };

  render() {
    //console.log(['a', 'b', 'c'][0])

    return (
      <div className="App">
        <h1>Top Reddit Posts by Year and Sub*</h1>

        <p>
          * A submission's score is simply the number of upvotes minus the
          number of downvotes. If five users like the submission and three users
          don't it will have a score of 2." via reddit's faq
        </p>
        <p>1. Select a timeperiod.</p>
        <ul>
          <li className="timeselect">Hour</li>
          <li className="timeselect">Day</li>
          <li className="timeselect">Week</li>
          <li className="timeselect">Month</li>
          <li className="timeselect">Year</li>
          <li className="timeselect">All</li>
        </ul>

        <p>2. Choose the number of posts per year.</p>
        <ul>
          <li id="increment">+</li>
          <li>{this.state.postCount}</li>
          <li id="decrement">-</li>
        </ul>
        {this.state.showUpdateButton && (
          <div
            className="updateButton"
            onClick={() => {
              console.log("here");
              this.callAPI();
            }}
          >
            Update
          </div>
        )}

        <h4>Top Reddot Posts in Past {this.state.timePeriod}</h4>
        <div className="svg-container">
          {this.state.posts.length && (
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts}
              labels={this.state.subs}
              clickHandler={this.bubbleClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
