import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Bubbles from '../Bubbles';

import { Common } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header'


const zipCodeList = ['63005','63011','63017','63021','63141','63001','63006','63022','63024','63032','63045','63099','63119','63122','63124','63131','63141','63144','63145','63146','63151','63167','63198','63043','63044','63074','63114','63141','63146','63011','63017','63021','63040','63088','62258','59047'];
const storeIdList = ['00033','00491','15102','16035','16113','6457'];
let { width, height } = Dimensions.get('window')


export default class Availability extends Component {
  static navigatorStyle = {
    navBarTextColor: '#f4002d',
    navBarTextFontSize: 18,
    navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
  };
  constructor(props) {
    super(props);
    this.state = {
      zipCode: null,
      email: null,
      isSearching: null,
      zipError: false,
      emailError: false,
      isAvailable: false,
      showNotAvailable: false,
      showEmailSent: false,
      customerId: this.props.customerId || null
    }
    this.sdk = this.props.sdk;
   // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

  }
  // onNavigatorEvent(event) { 
  //   if (event.type == 'NavBarButtonPress') {
  //     if (event.id == 'close') { 
  //       this.props.navigator.dismissModal();
  //     }
  //   }
  // }
  sendEmail = () => {
    let email = this.state.email;
    this.setState({
      emailError: false,
      isSearching: 'Sending...'
    })

    // TODO; validate email
 

    setTimeout(() => {

      this.setState({
        showEmailSent: true,
        isSearching: null
      })
      
    },2000);
  }
  searchZip = () => {
    let zip = this.state.zipCode;
    this.setState({
      zipError: false
    })
 
    let isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
    if (!isValidZip) {
      this.setState({
        zipError: true
      })
      return;
    }

    let zipSearch = 'https://storc.brandingbrand.com/v1/stores/acehardware?zip='+zip+'&radius=50';

    console.log(zipSearch)
    this.setState({
      isSearching: 'Searching...'
    })
    // setTimeout(() => {
    fetch(zipSearch)  
      .then((response) => {
        if (response.status === 400) {
          response._bodyText = "{\"invalid\":true}";
          response._bodyInit = "{\"invalid\":true}";
        }
        return response.json()
      })
      .then((responseData) => {
        console.log(responseData);
        if (responseData.invalid) {
          this.setState({
            zipError: true,
            isSearching: null
          })
          return false;
        }
        if (!responseData.length) {
          this.setState({
            showNotAvailable: true,
            isSearching: null
          })
        } else {
           let validStores = responseData.filter((store) => {
             return ~storeIdList.indexOf(store.custom.store_id);
           })
           
           if (!validStores.length) {
            this.setState({
              showNotAvailable: true,
              isSearching: null
            })
            return false;
           }
           // now show list of stores
           this.props.navigation.state.params.setStoresCallback(validStores);
           this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
      });
      // if (~zipCodeList.indexOf(zip)) {
      //   this.props.navigator.dismissModal({
      //     animationType: 'slide-down'
      //   });
      // } else {
      //   // not avail in your area
      //   this.setState({
      //     showNotAvailable: true,
      //     isSearching: null
      //   })
      // }

  //  }, 2000); 
    // simulating network
    // this.props.navigator.push({
    //   screen: 'ChatIOsdk',
    //   title: 'Rick\'s Ace Hardware',
    //   passProps: {
    //     area: this.state.area,
    //     name: this.state.firstName + ' ' + this.state.lastName,
    //     email: this.state.email,
    //     description: this.state.description,
    //     sdk: this.sdk,
    //     customerId: this.state.customerId,
    //     title: 'Rick\'s Ace Hardware',
    //     subtitle: this.state.description,
    //   },
    //   navigatorButtons: {
    //     leftButtons: [{
    //       id: 'close',
    //       disableIconTint: true,
    //       icon: require('../img/back_icn.png')
    //     }],
    //     rightButtons: [{
    //       id: 'end',
    //       title: 'End Chat',
    //       buttonColor: '#5b5b5b',
    //       buttonFontSize: 16,
    //       buttonFontFamily: 'HelveticaNeue-CondensedBold'

    //     }]
    //   }
    // });
  }
  pressArea = (area) => {
    this.setState({
      area: area
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
  renderZipContent() {
    if (this.state.showNotAvailable) {

      if (this.state.showEmailSent) {
        return (
          <View style={{flex: 1,width:'100%',paddingTop: 120}}>
          
              <View style={{padding:15,paddingBottom:0}}>
                <Text style={[styles.header,{textAlign:'center'}]}>We got it!</Text>
                <Text style={[Common.fontRegular,{paddingHorizontal:20,paddingTop:3,marginBottom:35,fontSize:16,lineHeight:15,color:'#5b5b5b',textAlign:'center'}]}>Be on the lookout for more information coming your way on Ace Chat.</Text>
              </View>
              <View style={{flexDirection: 'row',justifyContent: 'center',paddingLeft:15,paddingRight:15,marginBottom: 10}}>
                <TouchableOpacity
                    style={[styles.button,{width:195,height:40}]}
                    onPress={() => { return null; }}
                  >
                  {/* <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
                    <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
                  </LinearGradient> */}
                  <View style={styles.linearGradient}>
                    <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this.state.emailError && <Text style={[Common.fontMedium,{color:'#d80024',marginLeft:16,fontSize:15}]}>Please enter a valid email address.</Text>}
      
          </View>
        )
      }
      return (
        <View style={{flex: 1,width:'100%',paddingTop: 120}}>
        
            <View style={{padding:15,paddingBottom:0}}>
              <Text style={[styles.header,{textAlign:'center'}]}>Unfortunately, Ace Chat is not yet available near you.</Text>
              <Text style={[Common.fontRegular,{paddingHorizontal:20,paddingTop:3,marginBottom:35,fontSize:16,lineHeight:15,color:'#5b5b5b',textAlign:'center'}]}>Enter your email below and we’ll email you when Ace Chat is available in your neighborhood!</Text>
            </View>
            <View style={{flexDirection: 'row',alignItems: 'center',paddingLeft:15,paddingRight:15,marginBottom: 10}}>
              <TextInput 
                style={[Common.fontRegular,styles.inputEmail,{flex:1}]} 
                onChangeText={text => {
                    this.setState({email: text})
                    if (!text) {
                      this.setState({emailError: false})
                    }
                  }
                } 
                value={this.state.email}
                autoCorrect={false} 
                autoCapitalize="none" 
                placeholder="Email" 
              />
              <TouchableOpacity
                  style={styles.button}
                  onPress={this.sendEmail}
                >
                {/* <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
                  <Text style={styles.buttonText}>SUBMIT</Text>
                </LinearGradient> */}
                <View  style={styles.linearGradient}>
                  <Text style={styles.buttonText}>SUBMIT</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.emailError && <Text style={[Common.fontMedium,{color:'#d80024',marginLeft:16,fontSize:15}]}>Please enter a valid email address.</Text>}
    
        </View>
//        {this.renderSearching()}
      );
    }

    return (
     <View style={{flex: 1,width:'100%',paddingTop: 20}}>
    
        <View style={{padding:15,paddingBottom:0}}>
          <Text style={styles.header}>Enter your ZIP code to see if an Ace representative is available to chat near you.</Text>
        </View>
        <View style={{flexDirection: 'row',alignItems: 'center',paddingLeft:15,paddingRight:15,marginBottom: 10}}>
          <TextInput 
            style={[Common.fontRegular,styles.inputEmail,{flex:1}]} 
            onChangeText={text => {
                this.setState({zipCode: text})
                if (!text) {
                  this.setState({zipError: false})
                }
              }
            } 
            value={this.state.zipCode}
            autoCorrect={false} 
            autoCapitalize="none" 
            placeholder="Zip Code" 
            keyboardType = 'numeric'
          />
          <TouchableOpacity
              style={styles.button}
              onPress={this.searchZip}
            >
            <View style={styles.linearGradient}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </View>
            {/* <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </LinearGradient> */}
          </TouchableOpacity>
        </View>
        {this.state.zipError && <Text style={[Common.fontMedium,{color:'#d80024',marginLeft:16,fontSize:15}]}>Please enter a valid zip code.</Text>}

    </View>
   // {this.renderSearching()}
    );

  }

  render() {
    return (
      <View style={styles.RNcontainer}>
        <Header 
          navigation={this.props.navigation} 
          left="close" 
          onPressLeft={() => this.props.navigation.goBack()}
          title="CHAT AVAILABILITY" />
        <View style={{
          flex: 1,
          backgroundColor: '#eee6d9',
          width:'100%'
        }}>
        
          <View style={styles.container}>        
            {this.renderZipContent()}
            {this.renderSearching()}
          </View>

        </View>
      </View>

    );   
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee6d9'
  },
  RNcontainer: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
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
    height: 45,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 14,
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
    backgroundColor: '#e31836',
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
    width: 100,
    marginLeft: 10,
    //backgroundColor: '#d80024',
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