import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {GiftedChat, GiftedAvatar, Actions, Bubble, Message, Avatar, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from '../CustomActions';
import CustomView from '../CustomView';
import config from '../config';

class CustomMessage extends Message {
  renderAvatar() {
    return (
      <Avatar {...this.getInnerComponentProps()}         
        imageStyleTest={{
          right: {
            backgroundColor: '#aaa'
          },
          left: {
            backgroundColor: '#e31836'
          }     
        }}
        />
    );
  } 
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8
    },
    onTop: {
      alignSelf: "flex-start"
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: "flex-start"
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
};

export default class ChatIO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: [],
      customerId: null,
      chatId: null,
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      connected: false,
      PING: null
    };
    console.log(config)
    console.log(this.state.connected);
    this.socket = new WebSocket('wss://api.chat.io/customer/v0.2/rtm/ws?license_id='+config.chatio_license);
    this.socket.onopen = this.onConnect;

    this.socket.onclose = this.onDisconnect;
    this.socket.onmessage = this.onMessage;

    //this.emit = this.emit.bind(this);

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
  //  this.renderMessage = this.renderMessage.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    //this.renderChatFooter = this.renderChatFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

//   emit() {
//     if (this.state.connected) {
//       this.socket.send("It worked!")
//       this.setState(prevState => ({ open: !prevState.open }))
//     }
//   }
  onConnect = () => {
    
    this.setState({connected:true});
    console.log('connected!');
    this.apiSendLogin();
    this._PING = setInterval(() => {
      this.sendMessage("ping") 
    }, 30000);
  }; 
  onDisconnect = () => {
    console.log('disconnected!')
    this.setState({connected:false})
  }; 
  onMessage = (d) => {
    let msg = JSON.parse(d.data);
    
    //handle unsuccesed messages
    if (msg.success == false) {
      console.error(msg.payload.error)
      return 
    }

    if (msg.action !== 'ping') {
      console.log(msg);
    }
    
    switch (msg.action) {
      case "login": 
        return this.onMessageLogin(msg);
        break;

      case "start_chat":
        return this.onMessageStartChat(msg);
        break;

      case "incoming_event":
        return this.onIncomingEvent(msg);
        break;

      case "incoming_chat_thread":
        return this.onIncomingChatThread(msg);
        break;

      case "chat_users_updated": 
        return this.onChatUsersUpdated(msg);
        break;

      case "incoming_typing_indicator":
        return this.handleTypingIndicator(msg);
        break;
    }
  }; 

  onMessageLogin = (msg) => {
    this.setState({
      customerId: msg.payload.customer_id
    })
    return this.apiSendStartChat(); 
  }
  apiSendStartChat = () => {
   // this.sendMessage("start_chat");
    this.sendMessage("start_chat", {
      chat: {
        thread: {
          events: [{
            type: "filled_form",
            author_id: this.state.customerId,
            fields: [{
              "type": "text",
              "name": "name",
              "label": "Your name:",
              "required": true,
              "value": this.props.name
            },
            {
              "type": "email",
              "name": "email",
              "label": "E-mail:",
              "required": true,
              "value": this.props.email
            }]
          },{
            type: "message",
            author_id: this.state.customerId,
            text: this.props.description
          }]
        }
      }
    });     
  }
  doSomething = () => {
  
    // this.sendMessage("login", {
    //   "customer": {
    //     "id": this.state.customerId
    //   }
    // });  
    // this.sendMessage("get_chat_threads_summary", {
    //   "chat_id": this.state.chatId
    // });     
   // this.sendMessage("get_chats_summary"); 
  }

  onMessageStartChat = (msg) => {  
    console.log('set chat id')
    this.setState({
      chatId: msg.payload.chat.id
    })
  }
  apiSendChatMessage = (chatId,msg) => {
    this.sendMessage("send_event", {
      "chat_id": chatId, 
      "event": {
          "type": "message",
          "text": msg
    }});
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
  
    this.socket.send(JSON.stringify(protocolMessage));
  }

  apiSendLogin = () => {
    this.sendMessage("login", {
      customer: {
        name: this.props.name,
        email: this.props.email
      }
    });  
  }
  
  generateID = () => {
    return Math.random().toString(36)
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
    clearInterval(this._PING);
    // disconnect websocket
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('../data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  handleTypingIndicator = (msg) => {
    if (this._isMounted) {
      this.setState({
        typingText: msg.payload && msg.payload.typing_indicator && msg.payload.typing_indicator.is_typing ? 'Agent is typing...' : null,
      })
    }
  }

  onIncomingEvent = (msg) => {
    let event    = msg.payload.event;
    let username = this.props.name;
    console.log(event)
    // if its the agent message, remove typing indicator
    if (event.author_id != this.state.customerId) {
      username = 'Ace';
      this.setState({
        typingText: false
      })
    }
    if (this._isMounted && (msg.payload.chat_id === this.state.chatId) && event.type === 'message') {
      this.setState({
        messages: [{
          text: event.text,
          _id: event.id,
          createdAt: event.timestamp * 1000,
          user: {
            _id: event.author_id,
            name: username
          }
        }, ...this.state.messages]
      });

   //  this.doSomething();
    }
  }

  onIncomingChatThread = (msg) => {
    let chat = msg.payload.chat;
    console.log(chat)

    // wrong chat id
    if (this.state.chatId && chat.id != this.state.chatId) {
      return;
    }
    if (this._isMounted) {
      chat.thread.events.forEach((event,idx) => {
        if (event.type === 'message') {
          this.setState({
            messages: [{
              text: event.text,
              _id: event.id,
              createdAt: event.timestamp * 1000,
              user: {
                _id: event.author_id,
                name: this.props.name
              }
            }, ...this.state.messages]
          });
        }
      });
      this.setState({
        users: chat.users
      });

    }
  }

  onChatUsersUpdated = (msg) => {
    let users = msg.payload.updated_users;
    if (this._isMounted && (msg.payload.chat_id === this.state.chatId)) {
      if (users && users.added && users.added.length) {
        let addedUsers = '';
        users.added.forEach(function(usr,idx) {
          if (idx > 0) addedUsers += ', ';
          addedUsers += usr.name;
        })
        this.setState({
          users: [...users.added, ...this.state.users]
        })
        this.setState({
          messages: [{
            _id: Math.round(Math.random() * 1000000),
            text: addedUsers + ' has joined the chat',
            createdAt: Date.now(),
            system: true
          }, ...this.state.messages]
        });
      }
      console.log(this.state.users);
      if (users && users.removed_ids && users.removed_ids.length) {
        console.log('remove ids')
        var stateUsers = this.state.users.slice(); //copy array
        for (i=0; i<stateUsers.length; i++) {
          if (~users.removed_ids.indexOf(stateUsers[i].id)) {
            let name = stateUsers[i].name;
            stateUsers.splice(i, 1);
            i--;            
            this.setState({
              messages: [{
                _id: Math.round(Math.random() * 1000000),
                text: name + ' has left the chat',
                createdAt: Date.now(),
                system: true
              }, ...this.state.messages]
            });
          }
        }
        this.setState({ users: stateUsers });
      }
    }
  }

  onSend(messages) {
    this.apiSendChatMessage(this.state.chatId,messages[0].text);
  }


//   onSend(messages = []) {
//     this.setState((previousState) => {
//       return {
//         messages: GiftedChat.append(previousState.messages, messages),
//       };
//     });

//     // for demo purpose
//     this.answerDemo(messages);
//   }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }

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
            backgroundColor: '#fff',
          },
          right: {
            backgroundColor: '#e31836',
          }
        }}
      />
    );
  }

  // renderMessage(props) {
  //   return (
  //     <Message
  //       {...props}
  //       wrapperStyle={{
  //         left: {
  //           backgroundColor: '#f0f0f0',
  //         },
  //         right: {
  //           backgroundColor: '#e31836',
  //         }
  //       }}
  //     />
  //   );
  // }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 12,
          color: '#5b5b5b'
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
    if (this.state.typingText) {
      return (
        <View style={chatStyles.footerContainer}>
          <Text style={chatStyles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }
  renderAvatar = (props) => {
    return (
      <GiftedAvatar
        textStyle={{
          fontFamily: 'HelveticaNeue-CondensedBold',
          fontSize: 14
        }}
        avatarStyle={StyleSheet.flatten([styles[props.position].image, props.imageStyleTest[props.position]])}
        user={props.currentMessage.user}
        onPress={() => props.onPressAvatar && props.onPressAvatar(props.currentMessage.user)}
      />
    );
  }
  
  renderChatFooter(props) {
      return (
          <View>
              { this.state.connected
                ? <Text>Connected</Text>
                : <Text>Not Connected</Text>  
              }            
          </View>
      )
  }
  getVisitor() { 
    if (this.state.customerId) {
     return {
       _id: this.state.customerId
     } 
    } else {
      return {
       _id: null 
      };
    }
 }

  render() {
    return (
      <View style={{backgroundColor:'#eee6d9',flex: 1}}>
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        user={ this.getVisitor() }
        renderMessage={props => <CustomMessage {...props} />}
        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderAvatar={this.renderAvatar}
        renderSystemMessage={this.renderSystemMessage}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
        
      />
      </View>
    );
  }
}

const chatStyles = StyleSheet.create({
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

