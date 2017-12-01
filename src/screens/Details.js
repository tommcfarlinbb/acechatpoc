import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  View
} from 'react-native';


export default class Details extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Something')}
          title="SOMETHING (modal)"
        />
      </View>
    )
  }
}
