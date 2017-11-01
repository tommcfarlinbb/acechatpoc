
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { init } from "@livechat/livechat-visitor-sdk";

import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from '../CustomActions';
import CustomView from '../CustomView';

//export default class App extends Component<{}> {

  export default class Chat extends Component {
    constructor(props) {
      super(props);
      this.state = {
        messages: [],
        userInfo: {},
        onlineStatus: false,
        loadEarlier: true,
        typingText: null,
        agentIsTyping: false,
        isLoadingEarlier: false,
        users: {
          system: {
            name: 'system',
            _id: 'system',
          },
        }
      };
      this.visitorSDK = init({
        license: 9209525
      })
      this.visitorSDK.on('new_message', this.handleNewMessage.bind(this))
      this.visitorSDK.on('agent_changed', this.handleAgentChanged.bind(this))
      this.visitorSDK.on('status_changed', this.handleStateChange.bind(this))
      this.visitorSDK.on('typing_indicator', this.handleTypingIndicator.bind(this))
     // this.visitorSDK.on('chat_started', this.handleChatStarted.bind(this))
      this.visitorSDK.on('chat_ended', this.handleChatEnded.bind(this))
      this.visitorSDK.on('visitor_data', this.handleVisitorData.bind(this))
      this.handleInputTextChange = this.handleInputTextChange.bind(this)
      this.handleSend = this.handleSend.bind(this)
      this.getRenderInputToolbar = this.getRenderInputToolbar.bind(this)
      
      this._isMounted = false;
     // this.onSend = this.onSend.bind(this);
   //   this.onReceive = this.onReceive.bind(this);
      this.renderCustomActions = this.renderCustomActions.bind(this);
      this.renderBubble = this.renderBubble.bind(this);
      this.renderSystemMessage = this.renderSystemMessage.bind(this);
      this.renderFooter = this.renderFooter.bind(this);
      this.onLoadEarlier = this.onLoadEarlier.bind(this);
  
      this._isAlright = null;
    }    
  
    componentWillMount() {
      this._isMounted = true;
      this.setState(() => {
        return {
          messages: require('../data/messages.js'),
        };
      });
    }
  
    componentWillUnmount() {
      this._isMounted = false;
    }

    handleAgentChanged(newAgent) {
      this.addUser(newAgent, 'agent') 
    }

    handleVisitorData(visitorData) {
      console.log(visitorData)
      this.addUser(visitorData, 'visitor') 
    }

    addUser(newUser, type) {
      console.log('NEW USER: '+newUser.id+" - "+type)
      if (this._isMounted) {
        this.setState({
          users: Object.assign({}, this.state.users, {
            [newUser.id]: {
              _id: newUser.id,
              type: type,
              name: newUser.name || newUser.type,
              avatar: newUser.avatarUrl ? 'https://' + newUser.avatarUrl : null,
            }
          }),
          userInfo: {
            _id: newUser.id,
            type: type
          } 
        })
      }

    }

    handleStateChange(statusData) {
      if (this._isMounted) {
        this.setState({
          onlineStatus: statusData.status === 'online',
        })
      }
    }

    handleInputTextChange(text) {
      this.visitorSDK.setSneakPeek({ text: text })
    }
   

    handleChatEnded() {
      if (this._isMounted) {
        this.setState({
          messages: [{
            text: 'Chat session has ended',
            _id: String(Math.random()),
            createdAt: Date.now(),
            system: true
          }, ...this.state.messages]
        })
      }

    }

    handleTypingIndicator(typingData) {
      if (this._isMounted) {
        this.setState({
          typingText: typingData.isTyping ? 'Agent is typing...' : null,
        })
      }
    }

    handleSend(messages) {
      console.log(messages[0].text)
      this.visitorSDK.sendMessage({
        customId: String(Math.random()),
        text: messages[0].text,
      }).then((response) => {
        console.log('=====THEN=====')
        console.log(response)
    })
    .catch((error) => {
      console.log('=====ERROR=====')
        console.log(error)
    })
    }

    handleNewMessage(newMessage) {
      this.addMessage(newMessage)
    }

    addMessage(message) {
      if (this._isMounted) {
        this.setState({
          messages: [{
            text: message.text,
            _id: message.id,
            createdAt: message.timestamp,
            user: this.state.users[message.authorId],
          }, ...this.state.messages]
        })
      }
    }

    getRenderInputToolbar() {
      console.log('getRenderInputToolbar')
      return this.state.onlineStatus ? null : () => null
    }
  
    onLoadEarlier() {
      // this.setState((previousState) => {
      //   return {
      //     isLoadingEarlier: true,
      //   };
      // });
  
      // setTimeout(() => {
      //   if (this._isMounted === true) {
      //     this.setState((previousState) => {
      //       return {
      //         messages: GiftedChat.prepend(previousState.messages, require('../data/old_messages.js')),
      //         loadEarlier: false,
      //         isLoadingEarlier: false,
      //       };
      //     });
      //   }
      // }, 1000); // simulating network
    }
  
    // onSend(messages = []) {
    //   this.setState((previousState) => {
    //     return {
    //       messages: GiftedChat.append(previousState.messages, messages),
    //     };
    //   });
  
    //   // for demo purpose
    //   this.answerDemo(messages);
    // }
  
    answerDemo() {      
    
      this.setState((previousState) => {
        return {
          typingText: 'React Native is typing'
        };
      });

      setTimeout(() => { 
        this.setState((previousState) => {
          return {
            typingText: null,
          };
        });
      }, 2000);
    }
  
    // onReceive(text) {
    //   this.setState((previousState) => {
    //     return {
    //       messages: GiftedChat.append(previousState.messages, {
    //         _id: Math.round(Math.random() * 1000000),
    //         text: text,
    //         createdAt: new Date(),
    //         user: {
    //           _id: 2,
    //           name: 'React Native',
    //           // avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //         },
    //       }),
    //     };
    //   });
    // }
  
    renderCustomActions(props) {
      if (Platform.OS === 'ios') {
        return (
          <CustomActions
            {...props}
          />
        );
      }
      const options = {
        'Action 1': (props) => {
          alert('option 1');
        },
        'Action 2': (props) => {
          alert('option 2');
        },
        'Cancel': () => {},
      };
      return (
        <Actions
          {...props}
          options={options}
        />
      );
    }
  
    renderBubble(props) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f0f0f0',
            }
          }}
        />
      );
    }
  
    renderSystemMessage(props) {
      return (
        <SystemMessage
          {...props}
          containerStyle={{
            marginBottom: 25,
          }}
          textStyle={{
            fontSize: 18,
          }}
        />
      );
    }
  
    renderCustomView(props) {
      return (
        <CustomView
          {...props}
        />
      );
    }
  
    renderFooter(props) {
      console.log(this.state.typingText)
      if (this.state.typingText) {
        return (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {this.state.typingText}
            </Text>
          </View>
        );
      }
      return null;
    }

    getVisitor() {
      const visitorId = Object.keys(this.state.users).find((userId) => this.state.users[userId].type === 'visitor')
   
      if (this.state.users && this.state.users[visitorId] && visitorId) {
       return {
         _id: this.state.users[visitorId]._id,
         type: this.state.users[visitorId].type,
         name: this.state.users[visitorId].name || this.state.users[visitorId].type,
         avatar: this.state.users[visitorId].avatarUrl ? 'https://' + this.state.users[visitorId].avatarUrl : null,
       } 
      } else {
        return {
         _id: null 
        };
      }
   }
     
    render() {
        return (
          <GiftedChat        
            renderInputToolbar={this.getRenderInputToolbar()}
            onSend={this.handleSend}
            onInputTextChanged={ this.handleInputTextChange }
            user={ this.getVisitor() }
            messages={this.state.messages}
          //  onSend={this.onSend}
  
            // loading earlier button
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
    
            renderActions={this.renderCustomActions}
            renderBubble={this.renderBubble}
            renderSystemMessage={this.renderSystemMessage}
            renderCustomView={this.renderCustomView}
            renderFooter={this.renderFooter}
          />
        );
    }
  }
  
  const styles = StyleSheet.create({
    footerContainer: {
      marginTop: 5,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
    },
    footerText: {
      fontSize: 14,
      color: '#aaa',
    },
  });
  