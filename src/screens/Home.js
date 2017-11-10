
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Row from '../components/Row';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';

  class Home extends Component {
    constructor(props) {
      super(props);
      
      this._fab = false;
      this._rightButton = null;
      this._contextualMenu = false;
      this._toggleTabs = 'shown';
      this._toggleNavBar = 'shown';

      this.state = {
        chats: []
      }
    }



    currentChat = () => {
      this.props.navigator.push({
        screen: 'ChatIO',
        title: 'Chat'
      });
    };
    newChat = () => {
      this.props.navigator.push({
        screen: 'ChatIO',
        title: 'New Chat'
      });
    };
    allChats = () => {
      this.props.navigator.push({
        screen: 'AllChats',
        title: 'All Chats'
      });
    };
    onPressNewChat = () => {
      this.props.navigator.showModal({
        screen: 'NewChat',
        title: 'NEW ISSUE',
        navigatorStyle: {
          navBarTextColor: '#f4002d',
          navBarTextFontSize: 18,
          navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
        },
        navigatorButtons: {
          leftButtons: [{
            id: 'close',
            disableIconTint: true,
            icon: require('../img/close_icn.png')
          }]
        }
      });
    }
    renderChats() {
      if (this.state.chats.length) {
        return (
          <View>
            <Text>
              Hi, there are chats
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <Text style={styles.noChats}>You do not have a chat history.</Text>
          <Text style={[styles.noChats,{color: '#888',marginTop: 15, marginBottom: 30}]}>Create a new issue below to chat with one of our Ace representatives near you!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onPressNewChat}
          >
            <Text style={styles.buttonText}>CREATE NEW ISSUE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.getChats()}
          >
            <Text style={styles.buttonText}>GET CHATS</Text>
          </TouchableOpacity>
          {/* <ScrollView>
            <Row title={'Enter Current Chat'} onPress={this.currentChat} />
            <Row title={'Start New Chat'} onPress={this.newChat} />
            <Row title={'All Chats'} onPress={this.allChats} />
          </ScrollView> */}
        </View>
      );
    }
    render() {
      console.log(this.props);
      return (
        this.renderChats()
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 0,
      marginTop: -130,
      backgroundColor: '#eee6d9'
    },
    noChats: {
      color: '#777',
      fontSize: 16,
      width: 270,
      textAlign: 'center',
      fontFamily: 'HelveticaNeue-CondensedBold'
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#d80024',
      borderRadius: 5,
      borderWidth: 0,
      width: 195,
      height: 40,
      justifyContent: 'center',
      padding: 10
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'HelveticaNeue-CondensedBold'
    }
  });

  const mapStateToProps = state => {
    console.log(state)
    return {
      chatInfo: state.chatInfo
    }
  }
  // function mapStateToProps(state, ownProps) {
  //   return {
  //     nowPlayingMovies: state.movies.nowPlayingMovies,
  //     popularMovies: state.movies.popularMovies
  //   };
  // }
  
  // function mapDispatchToProps(dispatch) {
  //   return {
  //     actions: bindActionCreators(moviesActions, dispatch)
  //   };
  // }
  
  export default connect(mapStateToProps, actions)(Home);