import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Bubbles from '../Bubbles';

import { Common } from '../styles';
import LinearGradient from 'react-native-linear-gradient';

const images = {
  thumbsUp: require('../img/thumbsUp.png'),
  thumbsDown: require('../img/thumbsDown.png'), 
  close: require('../img/close-icn.png')
}
export default class ThumbsModal extends Component {
  static navigatorStyle = {
    navBarTextColor: '#f4002d',
    navBarTextFontSize: 18,
    navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
  };
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      rating: null,
      error: false,
    }
  }
  
  pressRate = (rating) => {
    this.setState({
      rating: rating
    })
    
  }
  closeModal = () => {
   if (this.props.closeHandler) {
     this.props.closeHandler();
   }
  }

  submitRating = () => {
    if (!this.state.rating) {
      return false;
    }
    let rating = this.state.rating === 'up' ? 'good' : 'bad';
    let ratingNum = this.state.rating === 'up' ? 1 : 0;
    
    this.props.sdk.sendEvent(this.props.chat, {
      type: 'annotation',
      annotation_type: 'rating',
      properties: {
        rating: {
          score: ratingNum,
          comment: this.state.comment || '-no commment submitted-',
        },
      },
    }).then(data => {
      
      this.props.sdk.updateChatThreadProperties(this.props.chat, data.thread, {
        rating: {
          score: ratingNum, 
          comment: this.state.comment || '-no commment submitted-'
        }
      }).then(data => {
        console.log(data)
      })
      this.props.updateHandler({
        _id: Math.round(Math.random() * 1000000),
        text: 'You rated this chat as: '+rating,
        createdAt: data.timestamp,
        system: true,
        rating: {
          comment: this.state.comment,
          rating: rating
        }
      },data.timestamp);
     this.closeModal();
    })


  }
  renderSearching() {
    if (this.state.isSearching) {
      return (
        <View style={{
          flex: 1, 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(238,230,217,.6)',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: width
        }}>
          <View style={{marginTop:-150}}>
            <Bubbles size={8} color="#d80024" />
            <Text style={[Common.fontMedium,{color:'#d80024',marginTop:10,fontSize:15}]}>{this.state.isSearching}</Text>
          </View>
        </View>
      );
    }
    return null;
  }
  renderThumbs() {

        return (  
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1,width:'100%',padding:20,paddingTop: 45}}>
          
              <TouchableWithoutFeedback                    
                   onPress={() => this.closeModal()}
                  >
                  <Image style={{height: 20,width: 20,position:'absolute',top:15,right:15}} source={images.close} />
              </TouchableWithoutFeedback>
              <View>
                <Text style={[Common.fontRegular,{color:'#5b5b5b',marginBottom:13,lineHeight:17,fontSize:15,paddingHorizontal:10,textAlign:'center'}]}>
Your feedback is very important to us.
How would you rate the help you received?
                </Text>
              </View>
              <View style={{flexDirection: 'row',justifyContent: 'center'}}>
                <TouchableWithoutFeedback                    
                   onPress={() => this.pressRate('up')}
                  >
                    <View style={[styles.rateButton,{borderTopRightRadius:0,borderBottomRightRadius:0},this.state.rating === 'up' && styles.rateSelected]}>
                      <View style={styles.rateContent}>
                        <Image style={{height: 32,width: 37,marginBottom:13,marginTop:2}} source={images.thumbsUp} />
                        <Text style={styles.rateContentTitle}>Good</Text>
                      </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.pressRate('down')}
                  >
                    <View style={[styles.rateButton,{borderTopLeftRadius:0,borderBottomLeftRadius:0,borderLeftWidth:0},this.state.rating === 'down' && styles.rateSelected]}>
                    <View style={styles.rateContent}>
                    <Image style={{height: 32,width: 36,marginBottom:13,marginTop:2}} source={images.thumbsDown} />
                      <Text style={styles.rateContentTitle}>Bad</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View style={{
                marginTop:18,
                marginBottom:18                
              }}              
              >
              <TextInput style={[Common.fontRegular,styles.inputEmail]} multiline={true} onChangeText={text => this.setState({comment: text})} value={this.state.comment} placeholder="Optional comment..." />
              </View>
             
 

              <View style={{flexDirection: 'row',justifyContent: 'center'}}>
                <TouchableOpacity
                    style={[styles.button,{height:40}]}
                    onPress={this.submitRating}
                  >
                  
                  {Platform.OS === 'android' && <View  style={[styles.linearGradient,{backgroundColor: '#e31836'}]}>
                  <Text style={styles.buttonText}>SUBMIT RATING</Text>
                    </View>}
                  {Platform.OS === 'ios' && <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
                    <Text style={styles.buttonText}>SUBMIT RATING</Text>
                    </LinearGradient>}
                </TouchableOpacity>
              </View>
              
          </View>
          </TouchableWithoutFeedback>
        )


  }

  render() {
    return (
      <View style={styles.container}>        
        {this.renderThumbs()}
      </View>
    );   
  }
}
const styles = StyleSheet.create({
  container: {
    width:295,
    height:420,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    //alignItems: 'center',
    backgroundColor: '#fff'
  },
  rateButton: {
    height: 97,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: .5,
    borderColor: '#aaaaaa',
  },
  rateSelected: {
    backgroundColor: '#f3f3f3'
  },
  rateContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  rateContentTitle: {
    fontFamily: 'HelveticaNeueLTStd-Cn',
    fontSize: 15,
    color: '#5b5b5b'
  },
  input: {
    height: 45,
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 15,     
    padding: 10,
    paddingLeft: 15, 
    paddingTop: 14,
  },
  firstName: {
    borderTopLeftRadius: 5,
    borderRightWidth: 0
  },
  lastName: {
    borderTopRightRadius: 5,
    borderLeftColor: '#f6f4f0'
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
    color: '#5b5b5b',
    fontFamily: 'HelveticaNeueLTStd-MdCn'
  },
  inputEmail: {
    height: 110,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 15,
    
    padding: 10,
    paddingLeft: 15,
    paddingTop: 14,
    borderRadius: 5
  },

  inputDescription: {
    height: 45,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa',
    fontSize: 15,
    padding: 10,
    paddingLeft: 15,
    paddingTop: 14,
  },
  areaContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  areaImage: {
    marginBottom: 11
  },  
  areaContentTitle: {
    fontFamily: 'HelveticaNeueLTStd-Cn',
    fontSize: 12,
    marginBottom: 6
  },
  areaItem: {
    height: 80,
    width: 65,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    marginRight: 4
  },
  areaItemActive: {
    borderColor: '#f4002d',
    backgroundColor: '#fdeff1',
    borderWidth: 2,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    borderWidth: 0,
    width: '100%',
    height: 45,
    justifyContent: 'center',
    padding: 10
  },
  button: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0,
   // height: 60,
    justifyContent: 'center',
  //  padding: 10
  },
  buttonText: {
      color: '#FFF',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'HelveticaNeue-CondensedBold',
      backgroundColor: 'transparent',
  }
});