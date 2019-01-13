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
    gaming: [],
    movies: [],
    technology: [],
    science: [],
    wallstreetbets: [],
    the_donald: []
  };

  state = {
    postCount: 50,
    timePeriod: "month",
    lastPostCount: 0,
    showSpinner: true,
    posts: this._initPosts,
    selectedBubble: ""
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
          <div className="instruct-1">1. Select a timeperiod.</div>
          <SelectableList
            startIndex={this.state.timePeriod}
            onSelect={timePeriod => this.onTimeSelect(timePeriod)}
          >
            <ListButton>day</ListButton>
            <ListButton>week</ListButton>
            <ListButton>month</ListButton>
            <ListButton>year</ListButton>
            <ListButton>all</ListButton>
          </SelectableList>

          {/* <p>2. Choose the number of posts per year.</p>
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
          </ul> */}

          {/* <div
            className="updateButton"
            onClick={() => {
              this.callAPI();
            }}
          >
            Update
          </div> */}
        </div>
        <div className="viz-container clear">
          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["politics"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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
          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["worldnews"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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
          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["gaming"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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
          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["movies"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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
          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["technology"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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
          
          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["science"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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


          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["wallstreetbets"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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

          <div className="sub">
            <BubbleChart
              width={700}
              height={500}
              selectedBubble={this.state.selectedBubble}
              bubbleData={this.state.posts["the_donald"]}
              clickHandler={() => {
                console.log("bubble click");
              }}
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

        <div className="tooltip">
          <p className="title">
            Pelosi says Trump doesn't get shutdown's effect on workers: 'He
            thinks maybe they could just ask their father for more money'
          </p>
          <hr />
          <p>jan-9 2019 </p>
          <p>score 61,283 </p>
          <p>comments 5,121</p>
          <a>Link</a>
        </div>
      </div>
    );
  }
}

export default App;
