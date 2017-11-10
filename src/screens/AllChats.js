
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View
} from 'react-native';
import Row from '../components/Row';
import config from '../config';

  export default class AllChats extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        messages: [],
        customerId: null,
        chatId: null,
        loadEarlier: true,
        typingText: null,
        isLoadingEarlier: false,
        connected: false,
        PING: null
      };
      this.socket = new WebSocket('wss://api.chat.io/customer/v0.2/rtm/ws?license_id='+config.chatio_license);
      this.socket.onopen = this.onConnect;
  
      this.socket.onclose = this.onDisconnect;
      this.socket.onmessage = this.onMessage;
    }

    onConnect = () => {
      this.setState({connected:true});
      console.log('connected!');
      this.doSomething();
      this._PING = setInterval(() => {
        this.sendMessage("ping") 
      }, 30000);
    }; 
    onDisconnect = () => {
      console.log('disconnected!')
      this.setState({connected:false});
    }; 
    onMessage = (d) => {
      let msg = JSON.parse(d.data);
          //handle unsuccesed messages
          if (msg.action !== 'ping') {
            console.log(msg);
          }

      if (msg.success == false) {
        console.error(msg.payload.error)
        return 
      }


      
      switch (msg.action) {
        case "login": 
          return this.doSomething(msg);
          break;

        // case "start_chat":
        //   return this.onMessageStartChat(msg);
        //   break;

        // case "incoming_event":
        //   return this.onIncomingEvent(msg);
        //   break;

        // case "incoming_typing_indicator":
        //   return this.handleTypingIndicator(msg);
        //   break;
      }
    }; 

    doSomething = () => {
      this.sendMessage("get_chats_summary");     
    }

      // emit message via websocket
    sendMessage = (name,payload) => {
      let protocolMessage = {
          action: name,
          id: this.generateID(), // id for match response
      }

      if (payload) {
          protocolMessage.payload = payload
      }
    
      // emit via socket.io
      this.socket.send(JSON.stringify(protocolMessage));
    }


    apiSendLogin = () => {
      this.sendMessage("login", {
        "customer": {
          "id": "6552ab1f-a54f-4447-401e-914685902ef1"
        }
      });  
      this.sendMessage("login");
    }
    onMessageLogin = (msg) => {
      this.setState({
        customerId: msg.payload.customer_id
      })
      return this.apiSendStartChat(); 
    }

    generateID = () => {
      return Math.random().toString(36)
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