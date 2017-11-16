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
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.subtitle}>{this.props.subtitle}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}></Text>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#5b5b5b',
    fontSize: 12,
    fontFamily: 'HelveticaNeue-CondensedBold'
  },
  subtitle: {
    color: '#f4002d',
    fontSize: 18,
    fontFamily: 'HelveticaNeue-CondensedBold'
  }
});