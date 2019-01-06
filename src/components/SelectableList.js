import React, { Component } from "react";

//does this need classs
export default class SelectableList extends Component {
  state = {
    activeIndex: 0
  };

  onSelect = activeIndex => {
    this.setState({ activeIndex });
    this.props.onSelect(activeIndex)
  };

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        isActive: index === this.state.activeIndex,
        onSelect: () => {
          this.onSelect(index);
        }
      });
    });
    return <ul>{children}</ul>;
  }
}
