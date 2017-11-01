
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View
} from 'react-native';
import Row from '../components/Row';

  export default class Home extends Component {
    constructor(props) {
      super(props);
  
      this._fab = false;
      this._rightButton = null;
      this._contextualMenu = false;
      this._toggleTabs = 'shown';
      this._toggleNavBar = 'shown';
     // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }


    currentChat = () => {
      this.props.navigator.push({
        screen: 'Chat',
        title: 'Chat'
      });
    };
    newChat = () => {
      this.props.navigator.push({
        screen: 'NewChat',
        title: 'New Chat'
      });
    };
    
    render() {
      return (
        <View style={styles.container}>
        <ScrollView>
          <Row title={'Enter Current Chat'} onPress={this.currentChat} />
          <Row title={'Start New Chat'} onPress={this.newChat} />
        </ScrollView>
        </View>
      )
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 140
    },
  });