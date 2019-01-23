import React, { Component } from "react";

//does this need classs
export default class SelectableList extends Component {
  // state = {
  //   activeIndex: this.props.startIndex
  // };

  onSelect = activeIndex => {
    // this.setState({ activeIndex });
    this.props.onSelect(activeIndex);
  };

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      let isActive;

      if (typeof this.props.activeIndex === "object") {
        isActive =
          this.props.activeIndex.indexOf(child.props.children) >= 0
            ? true
            : false;
      } else {
        isActive = child.props.children === this.props.activeIndex;
      }
      
      return React.cloneElement(child, {
        isActive,
        onSelect: () => {
          this.onSelect(child.props.children);
        }
      });
    });
    return <ul>{children}</ul>;
  }
}
