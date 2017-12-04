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
import Header from '../components/Header'

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.navigation)
  }
  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} title="CHAT" />
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eee6d9',
          width:'100%'
        }}>
          <Button
            onPress={() => this.props.navigation.navigate('Details')}
            title="Go to details"
          />
          <Button
            onPress={() => this.props.navigation.navigate('DetailsModal')}
            title="Go to details (modal)"
          />
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});