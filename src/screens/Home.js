
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';


import Row from '../components/Row';
import moment from 'moment';
import config from '../config';
import './userAgent';
import { AuthWebView } from '@livechat/chat.io-customer-auth';
import { init } from '@livechat/chat.io-customer-sdk';

import Bubbles from '../Bubbles';
import { Common } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
//import Rx from 'rxjs'
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as actions from '../actions';
const images = {
  arrowRight: require('../img/arrow-right.png'),
  Plumbing: require('../img/circle/plumbing.png'),  
  Lawn: require('../img/circle/lawn.png'),
  Painting: require('../img/circle/paint.png'),
  Outdoors: require('../img/circle/outdoor.png'),
  Hardware: require('../img/circle/hardware.png'),
  Auto: require('../img/circle/auto.png'),
  Tools: require('../img/circle/tools.png'),
  Indoors: require('../img/circle/indoor.png'),
  Other: require('../img/circle/other.png'),
};

const hideChats = [
  'OZ0H23E5X2'
]

  class Home extends Component {
    constructor(props) {
      super(props);
      
      this._fab = false;
      this._rightButton = null;
      this._contextualMenu = false;
      this._toggleTabs = 'shown';
      this._toggleNavBar = 'shown';
      this.state = {
        isConnected: false,
        chats: [],
        activeChats: [],
        previousChats: [],
        customerId: null,
        userData: [],
        isLoading: true
      }
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    onNavigatorEvent(event) {
    //  console.log('HOME EVENT')
    //  console.log(event)
      switch(event.id) {
        case 'willAppear':
        console.log('willAppear')
        if (this.state.isConnected) {
          // TODO - get chat history and iterate over to update
      //    console.log('// TODO - get chat history and iterate over to update')
          this.sdk.getChatsSummary({
            page: 1,
            limit: 25,
           })
            .then(({chatsSummary}) => {
            //  console.log('new chat summary!')
              console.log(chatsSummary)
              this.iterateOver(chatsSummary, (chat, report, fields) => {
          //     console.log(chat)                 
                chat.myLastVisit = chat.lastSeenTimestamps[this.state.customerId];
                const threadsArr = [chat.lastEvent.thread]
                chat.title    = fields['chat_'+chat.id];
                chat.area    = fields['category_'+chat.id];
                this.sdk.getChatThreads(chat.id, threadsArr)
                  .then(threads => {
             //         console.log(threads)
                      chat.isActive = threads[0].active;
                      
                      report();
                  })
                  .catch(error => {
                      console.log(error)
                  });
                      
              }, this.setChatState);
            })
            .catch(error => {
                console.log(error)
            })
        }
        break;
      }
    }

  iterateOver = (list, iterator, callback) => {
      var doneCount = 0; 
  
      function report() { 
          doneCount++;  
          if(doneCount === list.length)
              callback(list);
      }
      
      let userData = this.state.userData.slice();
      let fields = {};
      console.log(userData)
      let users = [];
      for (i=0; i<userData.length; i++) {
        if (userData[i].type === 'customer') {
          users.push(userData[i]);
        }
      }
      // sort ascending
      // users.sort(function(a, b) {
      //   return a.lastSeenTimestamp - b.lastSeenTimestamp
      // }); 
      // go through users to get all title fieldss
      for (var i=0; i<users.length; i++) {
        Object.assign(fields,users[i].fields);
      }
      let lastUserIdx = users.length-1;
      console.log('USERRRRRRRRRRRRRR')
      console.log(users)
      console.log(users[lastUserIdx])
      console.log(fields)
      for(var i = 0; i < list.length; i++) {
       // console.log(list[i],users[0].fields)
          iterator(list[i], report, fields)
      }
  }
  updateChats = (chat) => {
    let chatList = this.state.chats.slice();
    for (i=0; i<chatList.length; i++) {
      console.log(chat.event);
      if (chatList[i].id === chat.chat) {
        if (!chatList[i].lastEvent) chatList[i].lastEvent = {};
        chatList[i].lastEvent.text = chat.event.text;
        chatList[i].lastEvent.timestamp = chat.event.timestamp;
        chatList[i].order = chat.event.timestamp;
        chatList[i].isActive = true;
        break;
      }
    }
    this.updateChatHistory(chatList);
  }

  updateChatHistory = (chats) => {
    this.setState({
      chats: chats
    })
  }

  setChatState = (chats) => {
    console.log(chats)
    this.setState({
      chats: chats
    })
  }

  // getChatHistory = (chatsSummary) => {
  //   const id = chatsSummary[i].id
  //   const history = this.sdk.getChatHistory(id);

  //   history.next().then(result => {
  //     console.log(result.done)

  //     const events = result.value
  //     let title = null;
  //     console.log(events)
  //     for (i=0; i<events.length; i++) {
  //       if (events[i].type === 'message' && events[i].customId === 'description') {
  //         title = events[i].text;
  //         break;
  //       }
  //     }     
  //     // now loop through chats in state     
  //     for (i=0; i<chatsSummary.length; i++) {
  //       if (chatsSummary[i].id === id) {
  //         chatsSummary[i].title = title;
  //         break;
  //       }
  //     }
  //   })
  // }

  componentDidMount() {
    
    this._isMounted = true;

    this.props.navigator.showModal({
      screen: 'Availability',
      title: 'CHAT AVAILABILITY',     
      passProps: {
      },
      animationType: 'none',
      navigatorButtons: {
        leftButtons: [{
          id: 'close',
          disableIconTint: true,
          icon: require('../img/close_icn.png')
        }]
      }
    });

    this.sdk = init({ 
      license: config.chatio_license,
      clientId: '087dde4e017557c9d1cf0bab5c0e8547',
      redirectUri: 'https://app.chat.io/'
    });
    //     Rx.Observable.from(this.sdk)
    // .subscribe(([ eventName, eventData ]) => {
    //     console.log('RX.OBSERVABLE')
    //     console.log(eventName, eventData)
    // })


    this.sdk.on('connected', ({ chatsSummary, totalChats }) => {
      console.log('on connected', { chatsSummary, totalChats })

      // let updateObj = { fields: {} }
      // updateObj.fields.chat_OZ0I0XI2UJ = 'This is a test title';
      // this.sdk.updateCustomer(updateObj);

      this.updateChatHistory(chatsSummary);
      this.setState({
        isLoading: false,
        isConnected: true
      })
      this.iterateOver(chatsSummary, (chat, report, fields) => {
        console.log('------ CHAT DATA ------')
        console.log(chat)
          chat.title       = fields['chat_'+chat.id];
          chat.area        = fields['category_'+chat.id];
          chat.myLastVisit = chat.lastSeenTimestamps[this.state.customerId];
          if (chat.lastEvent) {
            const threadsArr = [chat.lastEvent.thread]
            this.sdk.getChatThreads(chat.id, threadsArr)
              .then(threads => {
                console.log('THREDSSSSSSSS')
                  console.log(threads)
                  chat.isActive = threads[0].active;                
                  report();
              })
              .catch(error => {
                  console.log(error)
              });
          } else {
            report();
          }

              
      }, this.setChatState);
    })

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
    // this.sdk.on('last_seen_timestamp_updated', payload => {
    //   console.log('last_seen_timestamp_updated')
    //   console.log(payload.chat)
    //   console.log(payload.user)
    //   console.log(payload.timestamp)
    // })
    this.sdk.on('new_event', (payload) => {
      console.log('new_event from HOME')
      if (this._isMounted) {
        console.log(payload)
        this.updateChats(payload);
     //   this.onIncomingEvent(payload);
      }      
    })
    this.sdk.on('user_data', (user) => {
      console.log('user_data');
      this.addGlobalUsers(user);
  //    this.onChatUsersUpdated(user);
    })
    // this.sdk.on('user_is_typing', (payload) => {
    //   this.handleTypingIndicator(payload,true);
    // })
    // this.sdk.on('user_stopped_typing', (payload) => {
    //   this.handleTypingIndicator(payload,false);
    // })
    this.sdk.on('thread_closed', ({ chat }) => {
      console.log('thread_closed')
      console.log(chat)
    })
    this.sdk.on('thread_summary', (thread_summary) => {
      console.log('thread_summary')
      console.log(thread_summary)
    })
  }



    // currentChat = () => {
    //   this.props.navigator.push({
    //     screen: 'ChatIO',
    //     title: 'Chat'
    //   });
    // };
    // newChat = () => {
    //   this.props.navigator.push({
    //     screen: 'ChatIO',
    //     title: 'New Chat'
    //   });
    // };
    // allChats = () => {
    //   this.props.navigator.push({
    //     screen: 'AllChats',
    //     title: 'All Chats'
    //   });
    // };
    onPressNewChat = () => {
      this.props.navigator.showModal({
        screen: 'NewChat',
        title: 'NEW ISSUE',     
        passProps: {
          sdk: this.sdk,
          customerId: this.state.customerId
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
    renderAuthView() {
      return (
        <View style={{
          height: 0,
          backgroundColor: 'transparent'
        }}><AuthWebView style={styles.auth} /></View>
      )
    }
    addGlobalUsers = (user) => {
      console.log(user)
      if (this._isMounted) {
        this.setState({
          userData: [user, ...this.state.userData]
        });
      }
    }
    loadChat = (chat) => {
      console.log('load chat with id: '+chat.id)
      chat.myLastVisit = Date.now();
      this.props.navigator.push({
        screen: 'ChatIOsdk',
        passProps: {
          sdk: this.sdk,
          customerId: this.state.customerId,
          chatId: chat.id,
          title: 'Rick\'s Ace Hardware',
          subtitle: chat.title.toUpperCase(),
          isActive: chat.isActive,
          userData: this.state.userData
        },
        navigatorButtons: {
          leftButtons: [{
            id: 'back',
            disableIconTint: true,
            icon: require('../img/back_icn.png')
          },
          {
            id: 'custom-button',
            component: 'CustomButton', 
            passProps: {
              text: 'test'
            }
          }
          ],
          rightButtons: [{
            id: 'end',
            disableIconTint: true,
            icon: require('../img/end-chat.png')  
          }]
        }
      });
    }
    renderChats(chats) {    
      if (this.state.isLoading) {
        return (
          <View style={styles.container}>
            { this.renderAuthView() }
            <Bubbles size={8} color="#d80024" />
          </View>
        );
      }  else {
        if (chats.length) {

          let activeChats   = chats.filter(chat => { return chat.isActive && chat.title && !~hideChats.indexOf(chat.id); }
                                ).sort((a, b) => { return b.order - a.order });
          let previousChats = chats.filter(chat => { return !chat.isActive && chat.title && !~hideChats.indexOf(chat.id); })
                                   .sort((a, b) => { return b.order - a.order });

          return (
            // {categories.map(category => (
            
            <View style={styles.containerChats}>
              { this.renderAuthView() }
              <ScrollView>
                <View style={{flex:1,alignItems:'center',marginBottom:30}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.onPressNewChat}
                  >
                    <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
                    <Text style={styles.buttonText}>START NEW CHAT</Text>
                    </LinearGradient>
                  

                  </TouchableOpacity>
                  
                </View>
                <Text
                  style={[Common.fontMedium,{
                    fontSize: 16,
                    color: '#5b5b5b',
                    marginBottom: 7,
                    paddingHorizontal: 16
                  }]}>Open Chats</Text>
                {!activeChats.length && <View style={styles.empty}><Text style={[Common.fontRegular,{flex:1,fontSize:16,color:'#999',textAlign:'center'}]}>No open chats</Text></View>}
                {activeChats.map(chat => {
                  return (
                  <TouchableHighlight
                    key={chat.id}
                    onPress={() => this.loadChat(chat)}
                    underlayColor={'#eee'}
                    style={styles.row}
                  >
                    <View style={{                  
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <View style={[styles.newMessageDotOff, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageDotOn]} />
                        <Image style={{height: 40,width: 40,marginRight: 10}} source={images[chat.area]} />
                        <View style={styles.chat}>
                        <View style={{                  
                            flexDirection: 'row',
                          }}>
                            <Text style={[Common.fontRegular,styles.store, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageColor]}>Rick's Ace Hardware</Text>
                            <Text style={[Common.fontRegular,styles.time, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageTime]}>{chat.lastEvent && moment(chat.lastEvent.timestamp).format('h:mm a')}</Text>
                            <Image style={{height: 14,width: 8,marginRight: 5,marginTop:-2}} source={images.arrowRight} />
                        </View>
                        <Text numberOfLines={1} style={[Common.fontRegular,styles.description, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageBold]}>{chat.title ? chat.title : 'Loading...'}</Text>
                        <Text numberOfLines={1} style={[Common.fontRegular,styles.message, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageColor]}>{chat.lastEvent && chat.lastEvent.text}</Text>
                      </View>
                    </View>
  
                  </TouchableHighlight>
  
                ) } )}     
  
                <Text
                  style={[Common.fontMedium,{
                    fontSize: 16,
                    color: '#5b5b5b',
                    marginBottom: 7,
                    marginTop: 30,
                    paddingHorizontal: 16
                  }]}>Previous Chats</Text>
                {!previousChats.length && <Text style={{flex:1,fontFamily: 'HelveticaNeue-CondensedBold',color:'#999',textAlign:'center'}}>No previous chats</Text>}  
                {previousChats.map(chat => (
                  <TouchableHighlight
                    key={chat.id}
                    onPress={() => this.loadChat(chat)}
                    underlayColor={'#eee'}
                    style={styles.row}
                  >
                    <View style={{                  
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <View style={[styles.newMessageDotOff, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageDotOn]} />
                        <Image style={{height: 40,width: 40,marginRight: 10}} source={images[chat.area]} />
                        <View style={styles.chat}>
                        <View style={{                  
                            flexDirection: 'row',
                          }}>
                            <Text style={[Common.fontRegular,styles.store, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageColor]}>Rick's Ace Hardware</Text>
                            <Text style={[Common.fontRegular,styles.time, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageTime]}>{chat.lastEvent && moment(chat.lastEvent.timestamp).format('h:mm a')}</Text>
                            <Image style={{height: 14,width: 8,marginRight: 5,marginTop:-2}} source={images.arrowRight} />
                        </View>
                        <Text numberOfLines={1} style={[Common.fontRegular,styles.description, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageBold]}>{chat.title ? chat.title : 'Loading...'}</Text>
                        <Text numberOfLines={1} style={[Common.fontRegular,styles.message, (chat.lastEvent && chat.lastEvent.timestamp > chat.myLastVisit) && styles.newMessageColor]}>{chat.lastEvent && chat.lastEvent.text}</Text>
                      </View>
                    </View>
  
                  </TouchableHighlight>
  
                ))} 
              </ScrollView>
            </View>
          );
        }
        return (
          <View style={styles.container}>
            { this.renderAuthView() }
            <Text style={styles.noChats}>You do not have a chat history.</Text>
            <Text style={[styles.noChats,{color: '#888',marginTop: 15, marginBottom: 30}]}>Create a new issue below to chat with one of our Ace representatives near you!</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onPressNewChat}
            >
              <Text style={styles.buttonText}>CREATE NEW ISSUE</Text>
            </TouchableOpacity>
          </View>
        );
      } 
      
    }
    render() {
      const {
        chats
      } = this.state;
      return (
        this.renderChats(chats)
      )
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
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
      borderWidth: 0,
      width: 195,
      height: 40,
      justifyContent: 'center',
      padding: 10
    },
    buttonText2: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'HelveticaNeue-CondensedBold',
      backgroundColor: 'transparent',
    },
    auth: {
      position: 'absolute',
      left: 500,
      top: -400,
      backgroundColor: '#eee6d9',
      height: 1
      
    },
    containerChats: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#eee6d9'
    },
    row: {
      height: 80,
      flex:1,
      paddingTop: 3,
      paddingRight: 18,
      paddingLeft: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e3e3e3',
      borderTopColor: '#e3e3e3',
    },
    empty: {
      height: 50,
      flex:1,
      paddingTop: 3,
      paddingRight: 18,
      paddingLeft: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#f3efe8',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderBottomColor: '#e2d3bc',
      borderTopColor: '#e2d3bc',
    },
    newMessageDotOff: {
      width: 5,
      height: 5,
      borderRadius: 5,
      marginRight: 7,
      backgroundColor: 'transparent'
    },
    newMessageDotOn: {
      backgroundColor: '#d80024'
    },
    chat: {
      width: '100%',
      flex: 1
    },
    time: {
      fontSize: 12,
      color: '#6c6c6c',
      flex: 1,
      textAlign: 'right',
      marginRight: 7
    },  
    store: {
      fontSize: 12,
      color: '#6c6c6c',
      flex: 5
    },  
    newMessageBold: {
      fontFamily: 'HelveticaNeueLTStd-BdCn'
    },
    newMessageColor: {
      color: '#000'
    }, 
    newMessageTime: {
      color: '#000',
      fontFamily: 'HelveticaNeueLTStd-BdCn'
    },   
    description: {
      fontSize: 15,
      color: '#000',
      lineHeight: 17
    },  
    message: {
      fontSize: 14,
      color: '#6c6c6c',
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
//      backgroundColor: '#d80024',

    },

  });

  // const mapStateToProps = state => {
  //   console.log(state)
  //   return {
  //     chatInfo: state.chatInfo
  //   }
  // }
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
  export default Home;
  //export default connect(mapStateToProps, actions)(Home);