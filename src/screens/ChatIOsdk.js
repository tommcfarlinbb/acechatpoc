import React from 'react';
import {
  Platform,
  Animated,
  StyleSheet,
  Text,
  Dimensions,
  ListView,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import {GiftedChat, Time, InputToolbar, Composer, Send, MessageText, utils, MessageContainer, Day, GiftedAvatar, Actions, Bubble, Message, Avatar, SystemMessage, MessageImage} from 'react-native-gifted-chat';
import CustomActions from '../CustomActions';
import config from '../config';
import './userAgent';
import { AuthWebView } from '@livechat/chat.io-customer-auth';
import { init } from '@livechat/chat.io-customer-sdk';
import Bubbles from '../Bubbles';
//import Rx from 'rxjs'
import moment from 'moment';
import { isWithinMinutes } from '../utils/isWithinMinutes';
import { Common } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import Modal from 'react-native-modal';
import ThumbsModal from './ThumbsModal';

let { isSameDay, isSameUser, warnDeprecated } = utils;

const { width, height } = Dimensions.get('window');

const images = {
  avatar: require('../img/AceAvatar.png'),
  send: require('../img/send.png'),
  thumbs: require('../img/thumbs.png'),
  thumbsUp: require('../img/thumbsUp.png'),
  thumbsDown: require('../img/thumbsDown.png')
};

class CustomGiftedChat extends GiftedChat {  
  renderMessages() {
    
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View;

    return (
      <AnimatedView style={{
        height: this.state.messagesContainerHeight,
      }}>
        <CustomMessageContainer
          {...this.props}

          invertibleScrollViewProps={this.invertibleScrollViewProps}

          messages={this.getMessages()}

          ref={component => this._messageContainerRef = component}
        />
        {this.renderChatFooter()}
      </AnimatedView>
    );
  } 
}

class CustomSystemMessage extends SystemMessage {
  render() {
    const { currentMessage } = this.props;
    if (currentMessage.rating) {
      return (
        <View style={[systemStyles.container, this.props.containerStyle]}>
          <View style={[systemStyles.wrapper, this.props.wrapperStyle,{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom:25
          }]}>
            {currentMessage.rating.rating === 'good' && <Image style={{width:65,height:58,marginBottom: 18}} source={images.thumbsUp} />}
            {currentMessage.rating.rating === 'bad' && <Image style={{width:65,height:58,marginBottom: 18}} source={images.thumbsDown} />}
            <Text style={[systemStyles.text, this.props.textStyle,{ 
              fontFamily: 'HelveticaNeueLTStd-Cn',
              fontSize: 14,
              marginBottom:5,
              color: '#5b5b5b'
            }]}>
              {currentMessage.text}
            </Text>
            {currentMessage.rating.comment && <Text style={[systemStyles.text, this.props.textStyle,{ 
              fontFamily: 'HelveticaNeueLTStd-Cn',
              fontSize: 14,
              paddingHorizontal: 25,
              color: '#5b5b5b'
            }]}>"{currentMessage.rating.comment}" </Text>}
          </View>
        </View>
      );
    }
    return (
      <View style={[systemStyles.container, this.props.containerStyle]}>
        <View style={[systemStyles.wrapper, this.props.wrapperStyle]}>
          <Text style={[systemStyles.text, this.props.textStyle]}>
            {currentMessage.text}
          </Text>
        </View>
      </View>
    );
  }
}

const systemStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: "transparent",
    color: "#b2b2b2",
    fontSize: 12,
    fontWeight: "300"
  }
});

class CustomMessageContainer extends MessageContainer {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
       // return r1.hash !== r2.hash;
        return true;
      }
    });

    const messagesData = this.prepareMessages(props.messages);
    this.state = {
      dataSource: dataSource.cloneWithRows(messagesData.blob, messagesData.keys)
    };
  }

}
  
class CustomMessage extends Message {
  renderAvatar() {
    return (
      <Avatar {...this.getInnerComponentProps()}         
        imageStyleTest={{
          right: {
            backgroundColor: '#aaa',
            width: 30,
            height: 30
          }   
        }}
        imageStyle={{
          left: {
            width: 30,
            height: 30
          },
          right: {
            width: 30,
            height: 30
          }
        }}
        />
    );
  } 
}

// /////////////////////////////////
// ///// CUSTOM DAY COMPONENT //////
// /////////////////////////////////
// /////////////////////////////////
const dayStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    // backgroundColor: '#ccc',
    // borderRadius: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 5,
    // paddingBottom: 5,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#5b5b5b',
    fontSize: 12,
    fontFamily: 'HelveticaNeue-CondensedBold',
  },
});

class CustomDay extends Day {
  render() {
    const { timeFormat } = this.props;
    
    if (!this.props.previousMessage.text || isWithinMinutes(this.props.currentMessage, this.props.previousMessage,5)) {
      return (
        <View style={[dayStyles.container, this.props.containerStyle]}>
          <View style={[dayStyles.wrapper, this.props.wrapperStyle]}>
            <Text style={[dayStyles.text, this.props.textStyle]}>
              {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('ddd LT').toUpperCase()}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}
class CustomBubble extends Bubble {
  renderTicks() {
    const {currentMessage, adminLastSeen, myLastMessage} = this.props;

    if (currentMessage.user._id !== this.props.user._id) {
        return;
    }
   
    if (adminLastSeen == currentMessage.createdAt) {
        return (
          <View>
            <Text
            style={{
            fontFamily: 'HelveticaNeueLTStd-MdCn',
            fontSize: 11,
            marginTop: 4,
            marginBottom: -3,
            color: '#5b5b5b'
          }}
          >Seen</Text>
          </View>
        )
    }
    if (currentMessage.pending) {
      return (
        <View>
          <Text style={{
            fontFamily: 'HelveticaNeueLTStd-MdCn',
            fontSize: 11,
            marginTop: 4,
            marginBottom: -3,
            color: '#5b5b5b'
          }}>Sending...</Text>
        </View>
      )
    }
    if (currentMessage.createdAt >= myLastMessage) {
      return (
        <View>
          <Text style={{
            fontFamily: 'HelveticaNeueLTStd-MdCn',
            fontSize: 11,
            marginTop: 4,
            marginBottom: -3,
            color: '#5b5b5b'
          }}>Delivered</Text>
        </View>
      )
    }
  
    return null;


    // if (currentMessage.sent || currentMessage.received) {
    //   return (
    //     <View style={styles.tickView}>
    //       {currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
    //       {currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
    //     </View>
    //   )
    // }
  }
  render() {
    return (
      <View>        
        <View style={[bubbleStyles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <View style={[bubbleStyles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.props.currentMessage.image && {backgroundColor:'transparent'}]}>
            <TouchableWithoutFeedback
              onLongPress={this.onLongPress}
              accessibilityTraits="text"
              {...this.props.touchableProps}
            >
              <View>
                {this.renderMessageImage()}
                {this.renderMessageText()}
                <View style={[bubbleStyles.bottom, this.props.bottomContainerStyle[this.props.position]]}>
                  
                  
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {this.renderTicks()}
        </View>        
      </View>

    );
  }
}

const styles = {
  general: StyleSheet.create({
    RNcontainer: {
      flex: 1,
      flexDirection:'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
  }),
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

    let { customerId, chatId, isActive, adminLastSeen, sdk } = this.props;
    
    this.state = {
      messages: [],
      users: [],
      userData: [],
      customerId: customerId || null,
      chatId: chatId || null,
      isActive: isActive || false,
      sneakPeakEnabled: isActive || false,
      loadEarlier: false,
      isLoading: true,
      typingText: null,
      isLoadingEarlier: false,
      connected: false,
      PING: null,
      username: null,
      isModalVisible: false,
      myLastMessage: null,
      adminLastSeen: adminLastSeen || null,
      minInputToolbarHeight: 64
    };
    this.sdk = sdk;
   // this.socket = new WebSocket('wss://api.chat.io/customer/v0.2/rtm/ws?license_id='+config.chatio_license);
   
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
  //  this.renderMessage = this.renderMessage.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    //this.renderChatFooter = this.renderChatFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null  ;
  //  this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  _showModal = () => this.setState({ isModalVisible: true })
  
  _hideModal = () => this.setState({ isModalVisible: false })

  // onNavigatorEvent(event) { 
  //   console.log(event)
  //   if (event.type == 'NavBarButtonPress') {
  //     if (event.id == 'back') { 
  //       this.props.navigator.pop({
  //         passProps: {
  //           reload: true
  //         }
  //       });
  //     }
  //     if (event.id == 'end') { 
  //       this.endChat(this.state.chatId);
  //       //this.props.navigator.pop();
  //     }
  //     if (event.id == 'close') { 
  //       this.props.navigator.dismissModal();
  //     }
  //   }
  // }
  componentWillMount() {
    console.log('----componentWillMount----')
    // this.props.navigator.setStyle({
    //   navBarCustomView: 'Header',
    //   navBarCustomViewInitialProps: {
    //     title: this.props.title,
    //     subtitle: this.props.subtitle
    //   }
    // });
  }

  updateMessages = (message,timestamp) => {
    this.sdk.updateLastSeenTimestamp(this.state.chatId,timestamp);
    this.setState({
      myLastMessage: timestamp,
      messages: [message, ...this.state.messages]
    });
  }

  endChat = () => {
    
    if (this.state.isActive) {
      
      this.sdk.closeThread(this.state.chatId).then(response => {
        this.setState({
          sneakPeakEnabled: false,
          messages: [{
            _id: Math.round(Math.random() * 1000000),
            text: 'You have ended the chat',
            createdAt: Date.now(),
            system: true
          }, ...this.state.messages]
        });
        setTimeout(() => {
          this._showModal();

          setTimeout(() => {
            this.setState({
              isActive: false
            });

            // this.props.navigator.showLightBox({
            //   screen: "ThumbsModal", 
            //   passProps: {
            //     updateHandler: this.updateMessages
            //   },
            //   style: {
            //     backgroundBlur: "none", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            //     backgroundColor: "rgba(0,0,0,.5)", // tint color for the background, you can specify alpha here (optional)
            //     tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
            //   }
            // });
          },600)

        }, 200);
  
      })
      .catch(error => {
        console.log(error)
      });
    }
  }
  
  // static navigatorStyle = {
  //   navBarCustomView: 'Header',
  //   navBarCustomViewInitialProps: {
  //     title: 'this.props.title',
  //     subtitle: 'this.props.subtitle'
  //   }
  // };


  apiSendStartChat = () => {
    if (!(this.props.name && this.props.description)) {
      return false;
    }
    if (this.props && this.props.callback) {
      this.props.callback();
    }
    this.sdk.startChat()
      .then(chat => {
        this.setState({
          chatId: chat.id
        });


        // TEST
        this.sdk.updateChatProperties(chat.id,{
          chatInfo: {
            title: this.props.description,
            store: this.props.storeTitle,
            area: this.props.area
          }
        })
        // temporary for storing chat titles
        // ////////////////////////////////
        // ////////////////////////////////
        // eventually replace with new configuration API
        // ////////////////////////////////
        // let payload = { fields: {} }
        // let chatKey = 'chat_'+chat.id;
        // let catkey = 'category_'+chat.id;
        // let storekey = 'store_'+chat.id;
        // payload.fields[catkey] = this.props.area;   
     
        // payload.fields[chatKey] = this.props.description;
        // payload.fields[storekey] = this.props.storeTitle;
        //this.sdk.updateCustomer(payload);
        // ////////////////////////////////
        // ////////////////////////////////
        // ////////////////////////////////

        

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
        setTimeout(() => {
          this.apiSendChatMessage(chat.id,this.props.description,true);
        },100);


      })
      .catch(error => {
        console.log(error);
      })

    
  }
  onMessageStartChat = (msg) => {  
    this.setState({
      chatId: msg.payload.chat.id
    })
  }
  apiSendChatMessage = (chatId,msg,isDescription) => {
    let payload = {
      text: msg
    }
   // if (isDescription) payload.customId = 'description';
   // console.log(payload);
    this.sdk.sendMessage(chatId,payload).then(message => {
      if (this._isMounted && (chatId === this.state.chatId)) {
        this.sdk.updateLastSeenTimestamp(chatId,message.timestamp).then(response => {
     //     console.log(response)
        })
        this.setState({
          sneakPeakEnabled: true,
          myLastMessage: message.timestamp,
          messages: [{
            text: msg,
            _id: message.id,
            createdAt: message.timestamp,
            sent: true,
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

    if (this.sdk && this._isMounted) {
      if (this.props.chatId) {
        
        // previous chat
        this.setState({
          chatId: this.props.chatId,
          userData: this.props.userData
        })
        // UPDATE USER OBJECT with last time youve viewed chat
       //  let payload = { fields: {} }
        //  let catkey = 'category_'+this.props.chatId;
        //  payload.fields[catkey] = 'Hardware';        
       //  this.sdk.updateCustomer(payload);

        this.sdk.updateLastSeenTimestamp(this.props.chatId,Date.now());
        setTimeout(()=>{
          this.getChatHistory(this.props.chatId);
        },200)   
      } else {
        // new chat
        this.setState({
          isActive: true
        })
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
      if (!this.props.name || !this.props.email) {
        return false;
      }
      this.setCustomerInfo({
        name: this.props.name,
        email: this.props.email
      });
      this.apiSendStartChat();  
    })

    // Rx.Observable.from(this.sdk)
    // .subscribe(([ eventName, eventData ]) => {        
    //     console.log(eventName, eventData)
    //     switch(eventName) {
    //       case 'connected':
    //         console.log('9999999999 CONNNECTED FROM RX 999999999999999')
    //         let { chatsSummary, totalChats } = eventData;
    //         console.log(chatsSummary, totalChats);
    //         break;
    //     }
    //     // if (eventName === 'user_data') {
    //     //   console.log('-----------------RX.OBSERVABLE-----------------')
    //     // }
    // })

    // /////////////////////////////////////
    // ////////// connection_lost //////////
    // /////////////////////////////////////
    this._connectionLostHandler = () => {
      console.log('connection_lost')
    };
    this.sdk.on('connection_lost', this._connectionLostHandler);


    // /////////////////////////////////////
    // ////////// disconnected //////////
    // /////////////////////////////////////
    this._disconnectedHandler = (reason) => {
      console.log('disconnected')
      console.log(reason)
    }
    this.sdk.on('disconnected', this._disconnectedHandler);


    // /////////////////////////////////////
    // //////// connection_restored ////////
    // /////////////////////////////////////
    this._connectionRestoredHandler = (payload) => {
      console.log('connection_restored')
      console.log(payload)
      console.log(this.props.chatId);
      //this.getChatHistory(this.props.chatId);
    };
    this.sdk.on('connection_restored', this._connectionRestoredHandler);


    // /////////////////////////////////////
    // /////////// customer_id /////////////
    // /////////////////////////////////////
    this._customerIdHandler = id => {
      console.log('customer id is', id)
      if (this._isMounted) {
        this.setState({
          customerId: id
        })
      }
    };
    this.sdk.on('customer_id', this._customerIdHandler);


    // /////////////////////////////////////////
    // ///// last_seen_timestamp_updated ///////
    // /////////////////////////////////////////
    this._lastSeenTimestampHandler = (payload) => {
      console.log('===========last_seen_timestamp_updated===========')
      console.log(payload)
      if (this._isMounted && this.state.chatId === payload.chat) {
        if (payload.user != this.state.customerId) {
          console.log('update ADMIMLASTSEEN')
          this.setState({
            adminLastSeen: payload.timestamp,
            messages: [{
              _id: Math.round(Math.random() * 1000000),
              createdAt: Date.now(),
              hideMessage: true,
              system: true
            }, ...this.state.messages]
          });
        }
      }
    };
    this.sdk.on('last_seen_timestamp_updated', this._lastSeenTimestampHandler);


    // ///////////////////////////////
    // ///////// new_event ///////////
    // ///////////////////////////////
    this._newEventHandler = (payload) => {
      console.log('new_event')
      if (this._isMounted) {
        this.onIncomingEvent(payload);
      }      
    };
    this.sdk.on('new_event', this._newEventHandler);


    // ///////////////////////////////
    // ///////// user_data ///////////
    // ///////////////////////////////   
    this._userDataHandler = (user) => {
      
      if (this._isMounted) {
        this.addGlobalUsers(user);
      }
    }
    this.sdk.on('user_data', this._userDataHandler);


    // ////////////////////////////////////
    // ///////// user_is_typing ///////////
    // ////////////////////////////////////   
    this._userIsTypingHandler = (payload) => {
      this.handleTypingIndicator(payload,true);
    };
    this.sdk.on('user_is_typing', this._userIsTypingHandler);


    // ////////////////////////////////////
    // //////// user_stopped_typing ///////
    // ////////////////////////////////////   
    this._userStoppedTypingHandler = (payload) => {
      this.handleTypingIndicator(payload,false);
    };
    this.sdk.on('user_stopped_typing', this._userStoppedTypingHandler);


    // ////////////////////////////////////
    // ///////// user_joined_chat /////////
    // ////////////////////////////////////  
    this._userJoinedChatHandler = ({ user, chat }) => {
      if (this._isMounted) {
        this.userChatStatusUpdate(user,chat,true);
      }      
    }; 
    this.sdk.on('user_joined_chat', this._userJoinedChatHandler);


    // ////////////////////////////////////
    // ////////// user_left_chat //////////
    // ////////////////////////////////////  
    this._userLeftChatHandler = ({ user, chat }) => {      
      if (this._isMounted) {
        this.userChatStatusUpdate(user,chat,false);
      }
    }
    this.sdk.on('user_left_chat', this._userLeftChatHandler);


    // ////////////////////////////////////
    // /////////// thread_closed //////////
    // ////////////////////////////////////  
    this._threadClosedHandler = ({ chat }) => {
      console.log('thread_closed')
      console.log(chat)
      if (this._isMounted) {
        this.closeChat(chat);
      }
    }
    this.sdk.on('thread_closed', this.threadClosedHandler);


    // ////////////////////////////////////
    // ////////// thread_summary //////////
    // ////////////////////////////////////
    // this._threadSummaryHandler = (thread_summary) => {
    //   console.log('thread_summary')
    //   console.log(thread_summary)
    // };
    // this.sdk.on('thread_summary', this._threadSummaryHandler);

  }

  userChatStatusUpdate = (user,chat,didJoin) => {
    
    let userData = this.state.userData.slice();
    
    let name = 'Agent';
    for (i=0; i<userData.length; i++) {
      if (userData[i].id === user) {
        name = userData[i].name;
      }
    }
    let msg = name + ' has ' + (didJoin ? 'joined' : 'left') + ' the chat';
    this.setState({
      messages: [{
        _id: Math.round(Math.random() * 1000000),
        text: msg,
        createdAt: Date.now(),
        system: true
      }, ...this.state.messages]
    });
  }
  closeChat = (chat) => {
    this.setState({
      sneakPeakEnabled: false,
      messages: [{
        _id: Math.round(Math.random() * 1000000),
        text: 'This chat has been closed',
        createdAt: Date.now(),
        system: true
      }, ...this.state.messages]
    });
  }

  loadHistory = (history,messages,users,settings) => {
    history.next().then(result => {
      const events = result.value;
      let newMessages = [];

      for (i=0; i<events.length; i++) {
        if (events[i].type === 'message' && events[i].text) {
          settings.username = users[settings.lastUserIdx].name || 'Customer';
          settings.avatar = null;
          if (events[i].author === this.state.customerId) {
            settings.chatDisplayName = settings.username;
            if (!settings.lastMessage || (events[i].timestamp > settings.lastMessage)) {
              settings.lastMessage = events[i].timestamp;
            }
          } else {
            settings.chatDisplayName = 'Ace';
            settings.avatar = images.avatar
          }
          newMessages = [{
            text: events[i].text,
            _id: events[i].id,
            createdAt: events[i].timestamp,
            user: {
              _id: events[i].author,
              name: settings.chatDisplayName,
              avatar: settings.avatar
            }
          }, ...newMessages];
        } else if (events[i].type === 'file' && events[i].contentType === 'image/jpeg') {
          settings.username = users[settings.lastUserIdx].name || 'Customer';
          settings.avatar = null;
          if (events[i].author === this.state.customerId) {
            settings.chatDisplayName = settings.username;
            if (!settings.lastMessage || (events[i].timestamp > settings.lastMessage)) {
              settings.lastMessage = events[i].timestamp;
            }
          } else {
            settings.chatDisplayName = 'Ace';
            settings.avatar = images.avatar
          }
          newMessages = [{
            image: events[i].url,
            _id: events[i].id,
            createdAt: events[i].timestamp,
            user: {
              _id: events[i].author,
              name: settings.chatDisplayName,
              avatar: settings.avatar
            }
          }, ...newMessages];
        }
      }

      messages = [...messages,...newMessages];

      this.setState({
        myLastMessage: settings.lastMessage
      })
      // all finished loading history
      if (result.done) {        
        this.setState({
          isLoading: false,
          messages: messages
        });
      } else {
        // load more
//        console.log('------------------------- load more -------------------------')
        this.loadHistory(history,messages,users,settings);
      }

    })
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

    let lastUserIdx = users.length-1;
    // users.sort(function(a, b) {
    //   return b.lastSeenTimestamp - a.lastSeenTimestamp
    // });   

    //let lastMessage = null;
    //let username = users[lastUserIdx].name || 'Customer';
    let tempName = users[lastUserIdx].name || 'Customer';
   // let chatDisplayName = username;
 //   let avatar = null;
    this.setState({
      username: tempName
    });    

    let messages = [];
    let settings = {
      lastUserIdx: lastUserIdx,
      lastMessage:null,
      username: tempName,
      chatDisplayName: tempName,
      avatar: null      
    }
    this.loadHistory(history,messages,users,settings);
  }

  setCustomerInfo = (userData) => {
    
    this.sdk.updateCustomer({
      name: userData.name,
      email: userData.email
    })
    .then(response => {
      //console.log(response)
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


    this.sdk.off('connection_lost', this._connectionLostHandler);
    this.sdk.off('disconnected', this._disconnectedHandler);
    this.sdk.off('connection_restored', this._connectionRestoredHandler);
    this.sdk.off('customer_id', this._customerIdHandler);
    this.sdk.off('last_seen_timestamp_updated', this._lastSeenTimestampHandler);
    this.sdk.off('new_event', this._newEventHandler);
    this.sdk.off('user_data', this._userDataHandler);
    this.sdk.off('user_is_typing', this._userIsTypingHandler);
    this.sdk.off('user_stopped_typing', this._userStoppedTypingHandler);
    this.sdk.off('user_joined_chat', this._userJoinedChatHandler);
    this.sdk.off('user_left_chat', this._userLeftChatHandler);
    this.sdk.off('thread_closed', this.threadClosedHandler);
    this.sdk.off('thread_summary', this._threadSummaryHandler);
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
    let avatar   = null;
    let username = this.props.name;
    this.setState({
      sneakPeakEnabled: true
    })
    console.log(payload);
    switch (event.type) {
      case 'message':          
        // if its the agent message, remove typing indicator
        if (event.author_id != this.state.customerId) {
          username = 'Ace';
          avatar = images.avatar
          this.setState({
            typingText: false
          })
        }
        if (this._isMounted && (payload.chat === this.state.chatId)) {

        // // UPDATE USER OBJECT with last time youve viewed chat
        // let customerPayload = { fields: {} }
        // let chatKeyLastVisit = 'lastVisit_'+this.state.chatId;
        // customerPayload.fields[chatKeyLastVisit] = Date.now().toString();
        // this.sdk.updateCustomer(customerPayload);

          this.sdk.updateLastSeenTimestamp(this.state.chatId,Date.now());
          this.setState({
            messages: [{
              text: event.text,
              _id: event.id,
              createdAt: event.timestamp,
              user: {
                _id: event.author,
                name: username,
                avatar: avatar
              }
            }, ...this.state.messages]
          });
        }
        break
      default:
        break
      }
    

  }

  addGlobalUsers = (user) => {
    if (this._isMounted) {
      this.setState({
        userData: [user, ...this.state.userData]
      });
    }
  }

  onSend(messages) {
    if (this._isMounted) {
      this.apiSendChatMessage(this.state.chatId,messages[0].text);
    }    
  }
  onImageSend = (images) => {
 
    
    if (this._isMounted) {
      let file = {};
      if (Array.isArray(images)) {
        // camera roll
        file = {
          uri: images[0].uri,
          name: images[0].filename
        }
      } else {
        // take picture
        file = {
          uri: images.path,
          name: 'CameraPhoto.jpg'
        }
      }
      console.log(file);
      let randomId = Math.round(Math.random() * 1000000);
      this.setState({
        messages: [{
          image: file.uri,
          _id: randomId,
          createdAt: Date.now(),
          sent: true,
          pending: true,
          user: {
            _id: this.state.customerId,
            name: this.props.name || this.state.username
          }
        }, ...this.state.messages]
      });


      this.sdk.sendFile(
        this.state.chatId,
        {
          file
          //customId, // optional
        },
        {
          onProgress: progress => console.log(`upload progress: ${progress}`),
        },
      )
      .then(response => {
        console.log('file uploaded!')
        console.log(response)

        let messagesCopy = this.state.messages.slice();
        for (i=0; i<messagesCopy.length; i++) {
          if (messagesCopy[i].image && messagesCopy[i]._id === randomId) {
            messagesCopy[i].pending = false;
            if (this.state.myLastMessage < messagesCopy[i].createdAt) {
              this.setState({
                myLastMessage: messagesCopy[i].createdAt
              });
            }        
          }
        }
        this.setState({
          messages: messagesCopy
        });


      })
      .catch(error => {
        console.log('error!')
        console.log(error)
      })
      

    }
  }

  renderDay = (props) => {
    return (
      <CustomDay
        {...props}
      />
    );
  }
  renderMessage = (props) => {
    if (props.currentMessage.hideMessage) {
      return null;
    }
    return (
      <CustomMessage {...props} />
    );
  }
  renderMessageImage = (props) => {
    return (
      <MessageImage 
        {...props}
        imageStyle={{
          width: 245,
          height: 190,
          borderRadius: 10,
          margin: 0
        }}
      />
  
    );
  }
  renderMessageText = (props) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: {
            marginTop: 9,
            marginBottom: 4,
            marginLeft: 12,
            marginRight: 12,
            fontSize: 15,
            lineHeight: 16,
            fontFamily: 'HelveticaNeueLTStd-Cn',
          },
          right: {
            marginTop: 9,
            marginBottom: 4,
            marginLeft: 12,
            marginRight: 12,
            lineHeight: 16,
            fontSize: 15,
            fontFamily: 'HelveticaNeueLTStd-Cn',
          }
        }}
      />
    );
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



  // renderTime = (props) => {
  //   return (
  //     <Time
  //       {...props}
  //       containerStyle={{
  //         left: {
  //           alignItems: 'center',
  //         },
  //         right: {
  //           alignItems: 'center',
  //         }
  //       }}
  //       textStyle={{
  //         left: {
  //           color: '#5b5b5b',
  //           fontSize: 12,
  //           fontFamily: 'HelveticaNeue-CondensedBold',
  //         },
  //         right: {
  //           color: '#5b5b5b',
  //           fontSize: 12,
  //           fontFamily: 'HelveticaNeue-CondensedBold',
  //         }
  //       }}
  //     />
  //   );
  // }

  onReopenChat = () => {
    this.setState({
      isActive: true
    })
  }
  renderInputToolbar = (props) => {
    if (!this.state.isActive) {
      return (
        <View style={{
           padding:10,
           paddingTop:10,
           marginTop:3,
           borderTopWidth: .5,
           borderTopColor: '#aaa',
           backgroundColor:'#fff',
           height:61
         }}
        >
            {/* <Text style={[Common.fontRegular,{marginBottom:3,textAlign:'center'}]}>Reopen Chat?</Text> */}
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center',
              flex:1
            }}>
              <TouchableOpacity
                    style={[commonStyles.button,{marginRight:10}]}
                    onPress={this.onReopenChat}
                  >
                  <LinearGradient colors={['#e21836', '#b11226']} style={[commonStyles.linearGradient, {width:250}]}>
                    <Text style={commonStyles.buttonText}>REOPEN CHAT</Text>
                    </LinearGradient>   
                    {/* <View style={[commonStyles.linearGradient, {width:250}]}>
                      <Text style={commonStyles.buttonText}>REOPEN CHAT</Text>
                    </View>                  */}

                  </TouchableOpacity>
            </View>
        </View>
      )
    }
    return (
      <InputToolbar
        {...props}
        primaryStyle={{
          padding: 5,
          paddingRight: 12
        }}

      />
    );
  }
  renderSend = (props) => {
    return (
      <Send
        {...props}
      ><Image style={{height: 18,width:20,marginBottom: 15,marginLeft: 14,}} source={images.send} /></Send>
    );
  }
  renderComposer = (props) => {
    return (
      <Composer
        {...props}
        placeholder='Start Typing...'
        placeholderTextColor='#aaaaaa'
        composerHeight={40}
        textInputStyle={{
          fontFamily: 'HelveticaNeueLTStd-Cn',
          fontSize: 15,
          borderWidth: 1,
          borderColor: '#e3e3e3',
          borderRadius: 5,
          lineHeight: 22,
          paddingTop: 12,
          paddingLeft: 10,
          marginTop: Platform.select({
            ios: 5,
            android: 0,
          }),
        }}
      />
    );
  }

  renderBubble(props) {
    return (
      <CustomBubble
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
  // renderTicks = (props) => {
  //   //const {currentMessage} = this.props;1510868005000
  // //  console.log(props)
    
  //   // Object.getOwnPropertyNames(props.nextMessage).length === 0

  //   if (props.user._id === this.state.customerId) {
  //     if (this.state.adminLastSeen >= props.createdAt) {
  //       if (props.createdAt >= this.state.adminLastSeen) {
  //         return (
  //           <View>
  //             <Text>Seen</Text>
  //           </View>
  //         )
  //       } else {
  //         return;
  //       }

  //     }
  //    // console.log(props.createdAt, this.state.myLastMessage)
  //     if (props.createdAt >= this.state.myLastMessage) {
  //       return (
  //         <View>
  //           <Text style={{
  //             fontFamily: 'HelveticaNeueLTStd-MdCn',
  //             fontSize: 11,
  //             marginTop: 4,
  //             marginBottom: -7,
  //             color: '#5b5b5b'
  //           }}>{props.createdAt} - {this.state.myLastMessage}</Text>
  //         </View>
  //       )
  //     }

  //   }
  //   return;
  // }

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
      <CustomSystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
          color: '#5b5b5b',
          fontFamily: 'HelveticaNeueLTStd-MdCn'
        }}
      />
    );
  }

  renderFooter(props) {
   if (this.state.typingText) {
      return (
        <View style={chatStyles.footerContainer}>
         <View style={{backgroundColor:'#fff',paddingLeft:7,borderRadius:12,width:60,height:25,justifyContent:'center',alignItems:'center',flex: 1}}>  
           <Bubbles typing={true} size={5} spaceBetween={4} color="#ccc" />
         </View>
          {/* <Text style={chatStyles.footerText}>
            { this.state.typingText  }
          </Text> */}
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
        avatarStyle={StyleSheet.flatten([styles[props.position].image, props.imageStyleTest[props.position],{width:30,height:30}])}
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
 renderAuthView() {
  if (this._isMounted) {
    return (
      <View style={{
        height: 0,
        backgroundColor: 'transparent'
      }}><AuthWebView /></View>
    )
  }
  return null;
}
 onInputTextChanged = (text) => {
   if (this.state.sneakPeakEnabled) {
     if (text && text.length > 2) {
      this.sdk.setSneakPeek(this.state.chatId,text);
     } else {
      this.sdk.setSneakPeek(this.state.chatId,'');
     }
   }
   
 }

 goBackHome = () => {
    if (this.props && this.props.goBackFromChat) {
      this.props.goBackFromChat();
    }
 //   this.props.navigation.goBack();
 }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.general.RNcontainer}>
        <Header 
          navigation={this.props.navigation} 
          left="back" 
          onPressLeft={this.goBackHome}
          right={this.state.isActive ? "end" : null} 
          onPressRight={this.endChat}
          storeTitle={this.props.storeTitle}
          title={this.props.title} />
        <View style={{
          flex: 1,
          backgroundColor: '#eee6d9',
          width:'100%'
        }}>
          
              
            <View style={{backgroundColor:'#eee6d9',justifyContent:'center',alignItems:'center',flex: 1}}>  
              <Bubbles size={8} color="#d80024" />
            </View>

        </View>
        </View>
      )
    } else {
      return (
        <View style={styles.general.RNcontainer}>
          <Header 
            navigation={this.props.navigation} 
            left="back" 
            onPressLeft={this.goBackHome}
            right={this.state.isActive ? "end" : null} 
            onPressRight={this.endChat}
            storeTitle={this.props.storeTitle}
            title={this.props.title} />
            <Modal 
              style={{flex:1,justifyContent:'center',alignItems:'center'}}
              isVisible={this.state.isModalVisible}
              onBackdropPress={() => this.setState({ isModalVisible: false })}
              backdropOpacity={0.50}
              avoidKeyboard={true}
            >
            <ThumbsModal 
            updateHandler={this.updateMessages}
            closeHandler={this._hideModal}
            chat={this.state.chatId}
            sdk={this.sdk}
            />
          </Modal>
          <View style={{
            flex: 1,
            backgroundColor: '#eee6d9',
            width:'100%'
          }}>
            
            <View style={{backgroundColor:'#eee6d9',flex:1}}>        
              <View style={{
                height:1,
                backgroundColor:'#eee6d9'
              }}>
                { this.renderAuthView() }
                
              </View>              
              <CustomGiftedChat
                messages={this.state.messages}
                onSend={this.onSend}
                loadEarlier={this.state.loadEarlier}
                onLoadEarlier={this.onLoadEarlier}
                isLoadingEarlier={this.state.isLoadingEarlier}
                user={{_id: this.state.customerId} }
                renderMessage={this.renderMessage}
                renderActions={this.renderCustomActions}
                renderBubble={this.renderBubble}
                renderAvatar={this.renderAvatar}
                renderSystemMessage={this.renderSystemMessage}

                renderFooter={this.renderFooter}
                renderDay={this.renderDay}
                renderMessageText={this.renderMessageText}
                renderTicks={this.renderTicks}
                myLastMessage={this.state.myLastMessage}
                adminLastSeen={this.state.adminLastSeen}
                renderInputToolbar={this.renderInputToolbar}
                renderComposer={this.renderComposer}
                renderSend={this.renderSend}
                renderMessageImage={this.renderMessageImage}
                onInputTextChanged={this.onInputTextChanged}

                onImageSend={this.onImageSend}

                minInputToolbarHeight={this.state.isActive ? 64 : 64}
              />              
            </View>

          </View>

        </View>
      
      );
    }
    
  
  }
}
const bubbleStyles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },

    wrapper: {
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      marginRight: 90,
      minHeight: 10,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 10,
    },
    containerToPrevious: {
      borderTopLeftRadius: 10,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      borderRadius: 10,
      backgroundColor: '#0084ff',
      marginLeft: 90,
      minHeight: 30,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 10,
    },
    containerToPrevious: {
      borderTopRightRadius: 10,
    },
  }),
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tick: {
    fontSize: 10,
    backgroundColor: 'transparent',
    color: 'white',
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10,
  }
};

const commonStyles = StyleSheet.create({
  linearGradient: {
    borderRadius: 5,
    borderWidth: 0,
    height: 38,
  //  backgroundColor: '#e31836',
    justifyContent: 'center',
    width:'100%'
  },
  button: {
    alignItems: 'center',
    flex:1,
    height:38
//      backgroundColor: '#d80024',

  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-CondensedBold',
    backgroundColor: 'transparent',
  },
})
const chatStyles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 14,
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

