import React, { Component } from "react";

//does this need classs
export default class SelectableList extends Component {
  state = {
    activeIndex: this.props.startIndex
  };

  onSelect = activeIndex => {
    this.setState({ activeIndex });
    this.props.onSelect(activeIndex);
  };

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        isActive: child.props.children === this.state.activeIndex,
        onSelect: () => {
          this.onSelect(child.props.children);
        }
      });
    });
    return <ul>{children}</ul>;
  }
}
