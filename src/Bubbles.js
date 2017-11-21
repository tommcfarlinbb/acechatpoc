import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, ART, View } from 'react-native';
const { Surface } = ART;

import Circle from './animated/Circle';

export default class Bubbles extends Component {
  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    typing: PropTypes.bool,
    spaceBetween: PropTypes.number
  };

  static defaultProps = {
    spaceBetween: 6,
    size: 11,
    typing: false,
    color: '#000'
  };

  state = {
    circles: [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ]
  };

  componentDidMount() {
    this.state.circles.forEach((val, index) => {
      const timer = setTimeout(() => this.animate(index), index * 280);
      this.timers.push(timer);
    });
  }

  componentWillUnmount() {
    this.timers.forEach((timer) => {
      clearTimeout(timer);
    });

    this.unmounted = true;
  }

  timers = [];

  animate(index) {
    Animated
      .sequence([
        Animated.timing(this.state.circles[index], {
          toValue: 1,
          duration: 650
        }),
        Animated.timing(this.state.circles[index], {
          toValue: 0,
          duration: 650
        })
      ])
      .start(() => {
        if (!this.unmounted) {
          this.animate(index);
        }
      });
  }

  renderBubble(index) {
    const { size, spaceBetween, color } = this.props;
    const scale = this.state.circles[index];
    const offset = {
      x: size + index * (size * 2 + spaceBetween),
      y: size
    };

    return (<Circle
      fill={color}
      radius={size}
      scale={scale}
      {...offset}
    />);
  }

  render() {
    const { size, spaceBetween, typing } = this.props;
    let width = size * 9 + spaceBetween * 2;
    const height = size * 2;
    if (typing) width = width-9;

    return (<Surface width={width} height={height}>
      {this.renderBubble(0)}
      {this.renderBubble(1)}
      {this.renderBubble(2)}
    </Surface>);
  }
}