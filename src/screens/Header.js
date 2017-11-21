import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.title) {
      return (
        <View style={styles.container}>
          <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{this.props.subtitle}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text numberOfLines={1} style={styles.title}></Text>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  title: {
    color: '#000',
    fontSize: 11,
    fontFamily: 'HelveticaNeueLTStd-Cn'
  },
  subtitle: {
    color: '#f4002d',
    fontSize: 15,
    fontFamily: 'HelveticaNeueLTStd-BdCn',
    marginBottom:2
  }
});