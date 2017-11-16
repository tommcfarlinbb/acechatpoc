import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  View,
} from 'react-native';

import {GiftedChat, GiftedAvatar, Actions, Bubble, Message, Avatar, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from '../CustomActions';
import CustomView from '../CustomView';
import config from '../config';
import { AuthWebView } from '@livechat/chat.io-customer-auth';
import { init } from '@livechat/chat.io-customer-sdk';
import Bubbles from '../Bubbles';
import Rx from 'rxjs'

const { width, height } = Dimensions.get('window');

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
      userData: [],
      customerId: this.props.customerId || null,
      chatId: this.props.chatId || null,
      loadEarlier: true,
      isLoading: true,
      typingText: null,
      isLoadingEarlier: false,
      connected: false,
      PING: null,
      username: null
    };
    this.sdk = this.props.sdk;
   // this.socket = new WebSocket('wss://api.chat.io/customer/v0.2/rtm/ws?license_id='+config.chatio_license);
   
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

    this._isAlright = null  ;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) { 
    console.log(event)
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') { 
        this.props.navigator.pop({
          passProps: {
            reload: true
          }
        });
      }
    }
  }
  componentWillMount() {
    this.props.navigator.setStyle({
      navBarCustomView: 'Header',
      navBarCustomViewInitialProps: {
        title: this.props.title,
        subtitle: this.props.subtitle
      }
    });
  }
  
  // static navigatorStyle = {
  //   navBarCustomView: 'Header',
  //   navBarCustomViewInitialProps: {
  //     title: 'this.props.title',
  //     subtitle: 'this.props.subtitle'
  //   }
  // };

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

      // case "incoming_typing_indicator":
      //   return this.handleTypingIndicator(msg);
      //   break;
    }
  }; 

  apiSendStartChat = () => {
    console.log('starting chat')
    this.sdk.startChat()
      .then(chat => {
        this.setState({
          chatId: chat.id
        });

        // TODO replace with new api
        // temporary for storing chat titles
        // ////////////////////////////////
        // ////////////////////////////////
        // eventually replace with new configuration API
        // ////////////////////////////////
        let payload = {}
        let chatKey = 'chat_'+chat.id;
        payload[chatKey] = this.props.description;
        // ////////////////////////////////
        // ////////////////////////////////
        // ////////////////////////////////

        this.sdk.updateCustomer(payload);

        this.sdk.sendEvent(chat.id, {
          type: 'filled_form',
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
        });
        this.apiSendChatMessage(chat.id,this.props.description,true);

        this.sdk.updateLastSeenTimestamp(chat.id,Date.now()).then(response => {
            console.log(response)
        })
      })
      .catch(error => {
        console.log(error);
      })

    
  }
  onMessageStartChat = (msg) => {  
    console.log('set chat id')
    this.setState({
      chatId: msg.payload.chat.id
    })
  }
  apiSendChatMessage = (chatId,msg,isDescription) => {
    let payload = {
      text: msg
    }
    if (isDescription) payload.customId = 'description';
    console.log(payload);
    this.sdk.sendMessage(chatId,payload).then(message => {
      console.log(message);
      if (this._isMounted && (chatId === this.state.chatId)) {
        this.setState({
          messages: [{
            text: msg,
            _id: message.id,
            createdAt: message.timestamp,
            user: {
              _id: message.author,
              name: this.props.name || this.state.username
            }
          }, ...this.state.messages]
        });
    //  this.doSomething();
      }
    }).catch(error => {
      console.log(error);
    });
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

  componentDidMount() {
    this._isMounted = true;
    console.log('MOUNT!!!!')
  //  this.sdk = init({ license: config.chatio_license });

    if (this.sdk && this._isMounted) {
      if (this.props.chatId) {
        // previous chat
        this.setState({
          chatId: this.props.chatId,
          userData: this.props.userData
        })
        this.getChatHistory(this.props.chatId);
      } else {
        // new chat
        let payload = {
          name: this.props.name,
          email: this.props.email
        }
        this.setCustomerInfo(payload);
        this.apiSendStartChat(); 
        this.setState({
          isLoading: false
        })
      }
 
    }
    this.sdk.on('connected', ({ chatsSummary, totalChats }) => {
      console.log('on connected', { chatsSummary, totalChats })
      this.setCustomerInfo({
        name: this.props.name,
        email: this.props.email
      });
      this.apiSendStartChat();  
    })

    // Rx.Observable.from(this.sdk)
    // .subscribe(([ eventName, eventData ]) => {
    //     console.log('RX.OBSERVABLE')
    //     console.log(eventName, eventData)
    // })

    this.sdk.on('connection_lost', () => {
      console.log('connection_lost')
    })
    this.sdk.on('disconnected', reason => {
      console.log('disconnected')
      console.log(reason)
    })
    this.sdk.on('connection_restored', payload => {
      console.log('connection_restored')
      console.log(payload.chatsSummary)
      console.log(payload.totalChats)
    })
    this.sdk.on('customer_id', id => {
      console.log('customer id is', id)
      this.setState({
        customerId: id
      })
    })
    this.sdk.on('last_seen_timestamp_updated', payload => {
      console.log('last_seen_timestamp_updated')
      console.log(payload.chat)
      console.log(payload.user)
      console.log(payload.timestamp)
    })
    this.sdk.on('new_event', (payload) => {
      console.log('new_event')
      if (this._isMounted) {
        this.onIncomingEvent(payload);
      }      
    })
    this.sdk.on('user_data', (user) => {
      console.log('user_data');
      if (this._isMounted) {
        this.addGlobalUsers(user);
      }
  //    this.onChatUsersUpdated(user);
    })
    this.sdk.on('user_is_typing', (payload) => {
      this.handleTypingIndicator(payload,true);
    })
    this.sdk.on('user_stopped_typing', (payload) => {
      this.handleTypingIndicator(payload,false);
    })
    this.sdk.on('thread_closed', ({ chat }) => {
      console.log('thread_closed')
      console.log(chat)
      if (this._isMounted) {
        this.closeChat(chat);
      }
    })
    this.sdk.on('thread_metada', (metadata) => {
      console.log('thread_metada')
      console.log(metadata)
    })
  }

  // function compare(a,b) {
  //   if (a.last_nom < b.last_nom)
  //     return -1;
  //   if (a.last_nom > b.last_nom)
  //     return 1;
  //   return 0;
  // }
  
  // objs.sort(compare);
  closeChat = (chat) => {
    this.setState({
      messages: [{
        _id: Math.round(Math.random() * 1000000),
        text: 'This chat has been closed',
        createdAt: Date.now(),
        system: true
      }, ...this.state.messages]
    });
  }
  getChatHistory = (id) => {
    const history = this.sdk.getChatHistory(id);
    
    let userData = this.props.userData.slice();
    let users = [];
    for (i=0; i<userData.length; i++) {
      if (userData[i].type === 'customer') {
        users.push(userData[i]);
      }
    }
    users.sort(function(a, b) {
      return b.lastSeenTimestamp - a.lastSeenTimestamp
    });   

    let username = users[0].name || 'Customer';
    let chatDisplayName = username;
    this.setState({
      username: username
    });    
    
    history.next().then(result => {
            
      const events = result.value
      
      for (i=0; i<events.length; i++) {
        if (events[i].type === 'message') {
          username = users[0].name || 'Customer';
          if (events[i].author === this.state.customerId) {
            chatDisplayName = username;
          } else {
            chatDisplayName = 'Ace';
          }
          this.setState({
            messages: [{
              text: events[i].text,
              _id: events[i].id,
              createdAt: events[i].timestamp,
              user: {
                _id: events[i].author,
                name: chatDisplayName
              }
            }, ...this.state.messages]
          });
        }
      }
      if (result.done) {
        this.setState({
          isLoading: false
        })
      }

    })
  }

  setCustomerInfo = (userData) => {
    console.log('setCustomerInfo');
    this.sdk.updateCustomer({
      name: userData.name,
      email: userData.email
    })
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error);
    })

  }
  // componentWillMount() {
    
  //   this.setState(() => {
  //     return {
  //       messages: require('../data/messages.js'),
  //     };
  //   });
  // }

  componentWillUnmount() {
    this._isMounted = false;
  //  clearInterval(this._PING);
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

  handleTypingIndicator = (payload,isTyping) => {
    if (this._isMounted && (payload.chat === this.state.chatId)) {  
      this.setState({
        typingText: isTyping ? 'Agent is typing...' : null,
      })
    }
  }

  onIncomingEvent = (payload) => {
    let event    = payload.event;
    let username = this.props.name;
    console.log(payload);
    switch (event.type) {
      case 'message':          
        // if its the agent message, remove typing indicator
        if (event.author_id != this.state.customerId) {
          username = 'Ace';
          this.setState({
            typingText: false
          })
        }
        if (this._isMounted && (payload.chat === this.state.chatId)) {
          this.setState({
            messages: [{
              text: event.text,
              _id: event.id,
              createdAt: event.timestamp,
              user: {
                _id: event.author,
                name: username
              }
            }, ...this.state.messages]
          });
        }
        break
      default:
        break
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
  addGlobalUsers = (user) => {
    if (this._isMounted) {
      this.setState({
        userData: [user, ...this.state.userData]
      });
    }
  }
  onChatUsersUpdated = (payload) => {
    console.log(payload);

    if (this._isMounted && payload.type === 'agent') {
    // TODO:  if (this._isMounted && (payload.chat === this.state.chatId)) {
      if (payload.present) {
        // users.added.forEach(function(usr,idx) {
        //   if (idx > 0) addedUsers += ', ';
        //   addedUsers += usr.name;
        // })
        this.setState({
          users: [payload, ...this.state.users]
        })
        this.setState({
          messages: [{
            _id: Math.round(Math.random() * 1000000),
            text: payload.name + ' has joined the chat',
            createdAt: Date.now(),
            system: true
          }, ...this.state.messages]
        });
      }
      else {
        var stateUsers = this.state.users.slice();
        for (i=0; i<stateUsers.length; i++) {
          if (stateUsers[i].id === payload.id) {
            let name = payload.name;
            stateUsers.splice(i, 1);                      
            this.setState({
              messages: [{
                _id: Math.round(Math.random() * 1000000),
                text: name + ' has left the chat',
                createdAt: Date.now(),
                system: true
              }, ...this.state.messages]
            });
            break; 
          }
        }
      }
    }
  }

  onSend(messages) {
  //   const properties = {
  //     name: 'sasdafdsd Doe',
  //     email: 'john.doe@example.com'
  //   }
  //   this.sdk.updateCustomer(properties)
  //   .then(response => {
  //     console.log(response)
  // })
  // .catch(error => {
  //     console.log(error)
  // })
    this.apiSendChatMessage(this.state.chatId,messages[0].text);
  }

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
    console.log('this.state.customerId: '+this.state.customerId);
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
    if (this.state.isLoading) {
      return (
        <View style={{backgroundColor:'#eee6d9',justifyContent:'center',alignItems:'center',flex: 1}}>  
          <Bubbles size={8} color="#d80024" />
        </View>
      )
    } else {
      return (
        <View style={{backgroundColor:'#eee6d9',flex: 1}}>          
          <View style={styles.container}>
            <AuthWebView license={config.chatio_license} />
          </View>
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
}

const chatStyles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  }, 
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    top: 0,
    opacity: 1,
    backgroundColor: '#fff',
    width: width
  },  
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

