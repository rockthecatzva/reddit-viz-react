import React, { Component } from "react";

export default class Tabs extends Component {
  state = {
    activeIndex: 0
  };

  selectTabIndex = activeIndex => {
    this.setState({ activeIndex });
  };

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      console.log(child);
      return React.cloneElement(child, {
        activeIndex: this.state.activeIndex,
        onTabSelect: this.selectTabIndex
      });
    });
    return <div>{children}</div>;
  }
}
