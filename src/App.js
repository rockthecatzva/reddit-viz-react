import React, { Component } from "react";

import SelectableList from "./components/SelectableList";
import ListButton from "./components/ListButton";
// import { select, selectAll } from "d3-selection";
// import ReactD3Wrapper from "./ReactD3Wrapper";
import axios from "axios";
import BubbleChart from "./components/BubbleChart";

class App extends Component {
  state = {
    postCount: 5,
    timePeriod: "year",
    lastPostCount: 0,
    posts: {
      politics: [],
      worldnews: [],
      gaming: [],
      movies: [],
      technology: [],
      science: []
    },
    selectedBubble: ""
    // subs: ["politics", "worldnews", "gaming", "movies", "technology", "science"]
  };

  callAPI() {
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
              image: ob.data.hasOwnProperty("preview")
                ? ob.data.preview.images[0].source.url
                : null,
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
      const labels = f.map(s=>s[0].sub);
      console.log(labels)

      const posts = [...f].reduce((curr, acc, i) => {
        console.log(curr)
        
        return { ...{[labels[i]]: curr}, ...acc };
      }, {});
      console.log(posts);
      this.setState({ posts, lastPostCount: this.state.postCount });
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Top Reddit Posts by Year and Sub*</h1>
        <div>
          <p>
            * A submission's score is simply the number of upvotes minus the
            number of downvotes. If five users like the submission and three
            users don't it will have a score of 2." via reddit's faq
          </p>
          <p>1. Select a timeperiod.</p>
          <SelectableList
            onSelect={() => {
              console.log("Select");
            }}
          >
            <ListButton>Hour</ListButton>
            <ListButton>Day</ListButton>
            <ListButton>Week</ListButton>
            <ListButton>Month</ListButton>
            <ListButton>Year</ListButton>
            <ListButton>All</ListButton>
          </SelectableList>

          <p>2. Choose the number of posts per year.</p>
          <ul>
            <li
              onClick={() => {
                this.setState({ postCount: (this.state.postCount += 1) });
              }}
            >
              +
            </li>
            <li>{this.state.postCount}</li>
            <li
              onClick={() => {
                if (this.state.postCount > 0) {
                  this.setState({ postCount: (this.state.postCount -= 1) });
                }
              }}
            >
              -
            </li>
          </ul>

          <div
            className="updateButton"
            onClick={() => {
              console.log("here");
              this.callAPI();
            }}
          >
            Update
          </div>
        </div>
        <h4>Top Reddot Posts in Past {0}</h4>
        <div className="svg-container">
          <div className="sub">
            <h3>r/politics}</h3>
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["politics"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
