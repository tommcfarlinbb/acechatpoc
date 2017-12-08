import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { Common } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header'

const images = {
  plumbing: require('../img/plumbing.png'),
  plumbing_icn: require('../img/plumbing_icn.png'),
  lawn: require('../img/lawn.png'),
  electrical: require('../img/electrical.png'),
  paint: require('../img/paint.png'),
  outdoors: require('../img/outdoors.png'),
  hardware: require('../img/hardware.png'),
  heatingCooling: require('../img/heatingCooling.png'),
  tools: require('../img/tools.png'),
  indoor: require('../img/indoor.png'),
  other: require('../img/other.png'),
  arrowRight: require('../img/arrow-right.png')
};

export default class NewChat extends Component {
  // static navigatorStyle = {
  //   navBarTextColor: '#f4002d',
  //   navBarTextFontSize: 18,
  //   navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
  // };
  constructor(props) {
    super(props);

    console.log('------------PROPS---------------')
    console.log(this.props)
    this.state = {
      area: null,
      firstName: this.props.firstName || null,
      lastName: this.props.lastName || null,
      email: this.props.email || null,
      store: this.props.store,
      errors: {},
      description: null,
      customerId: this.props.customerId || null
    }
    this.sdk = this.props.sdk;
//    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

  }
  // onNavigatorEvent(event) { 
  //   console.log(event)
  //   if (event.type == 'NavBarButtonPress') {
  //     if (event.id == 'close') { 
  //       this.props.navigator.dismissModal();
  //     }
  //   }
  // }
  beginChat = () => {
    if (!(this.state.firstName && this.state.description)) {      
      let errors = {};
      if (!this.state.firstName) {
        errors.firstName = true;
      }
      if (!this.state.description) {
        errors.description = true;
      }
      this.setState({
        errors: errors
      });
      return false;
    }
    this.setState({
      errors: false
    });

    storage.save({
      key: 'userState', 
      data: { 
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email
      }
    });
    
    this.props.callback({
        loading: true,
        area: this.state.area,
        name: this.state.firstName + ' ' + this.state.lastName,
        email: this.state.email,
        description: this.state.description,
        sdk: this.sdk,
        customerId: this.state.customerId,
        title: 'Rick\'s Ace Hardware',
        subtitle: this.state.description,
    });
    this.props.closeHandler();

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
  renderError() {
    if (this.state.errors && (this.state.errors.firstName || this.state.errors.description) && (!this.state.firstName || !this.state.description)) {
      return (
        <Text style={[Common.fontMedium,{marginTop:10,paddingLeft:10,fontSize:13,color:'#f4002d'}]}>Please complete the required fields above</Text>
      )
    }
    return null;
  }
  render() {
    let areas = [
      { name: 'Electrical', icon: 'electrical' },
      { name: 'Plumbing', icon: 'plumbing_icn' },
      { name: 'Tools', icon: 'tools' },
      { name: 'Lawn & Garden', icon: 'lawn' },
      { name: 'Heating & Cooling', icon: 'heatingCooling' },
      { name: 'Home Goods', icon: 'indoor' },
      { name: 'Hardware', icon: 'hardware' },
      { name: 'Outdoor Living', icon: 'outdoors' },
      { name: 'Paint', icon: 'paint' },
      { name: 'Other', icon: 'other' }      
    ];
    let areaList = areas.map((area,idx) => {
      return (
        <TouchableWithoutFeedback key={idx} onPress={() => this.pressArea(area.name)}>
          <View style={[styles.areaItem, this.state.area === area.name && styles.areaItemActive]}>
            <View style={styles.areaContent}>
              <Image style={styles.areaImage} source={images[area.icon]} />
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 32
              }}>
                <Text style={styles.areaContentTitle}>{area.name}</Text>
              </View>              
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    })
    return (
      <View style={styles.RNcontainer}>
        <Header 
          left="close" 
          onPressLeft={this.props.closeHandler}
          title="NEW ISSUE" />
        <View style={{
          flex: 1,
          backgroundColor: '#eee6d9',
          width:'100%'
        }}>
          
          <View style={styles.container}>
            <ScrollView style={{flex: 1,width:'100%',marginBottom:150}}>
                <View style={{padding:10,paddingBottom:0}}>
                  <Text style={styles.header}>Contact information:</Text>
                  <View style={{
                    flexDirection: 'row',
                  }}>
                    <TextInput style={[Common.fontRegular,styles.input,styles.firstName,this.state.errors.firstName && !this.state.firstName && styles.inputError]} onChangeText={text => this.setState({firstName: text})} value={this.state.firstName} autoCorrect={false}  placeholder="First Name *" />
                    <TextInput style={[Common.fontRegular,styles.input,styles.lastName]} onChangeText={text => this.setState({lastName: text})} value={this.state.lastName} autoCorrect={false} placeholder="Last Name (optional)" />
                  </View>
                </View>
                <View style={{paddingLeft:10,paddingRight:10,marginBottom: 10}}>
                  <TextInput style={[Common.fontRegular,styles.inputEmail]} onChangeText={text => this.setState({email: text})} value={this.state.email} autoCorrect={false} autoCapitalize="none" placeholder="Email (optional)" />
                </View>

                <View style={{padding:7,paddingLeft:8,paddingBottom:0,marginBottom:6}}>
                  <Text style={[styles.header,{paddingLeft:2}]}>Select topic:</Text>
                  <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    flexWrap: 'wrap',                
                    justifyContent: 'flex-start'
                  }}>
                    { areaList }
                  </View>
                </View>


                <View style={{padding:10,paddingBottom:0}}>
                  <Text style={styles.header}>Briefly describe your issue:</Text>
                  <View>
                    <TextInput style={[Common.fontRegular,styles.inputDescription,this.state.errors.description && !this.state.description && styles.inputError]} onChangeText={text => this.setState({description: text})}  placeholder="Description *" />
                  </View>
                </View>
                {this.renderError()}

            </ScrollView>
          
            <View style={{padding: 10,height:58,backgroundColor:'#fff',width:'100%',alignItems:'center'}}>
              <TouchableOpacity
                  style={styles.button}
                  onPress={this.beginChat}
                >
                <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
                  <Text style={styles.buttonText}>BEGIN CHAT</Text>
                </LinearGradient>
                {/* <View style={styles.linearGradient}>
                  <Text style={styles.buttonText}>BEGIN CHAT</Text>
                </View> */}
                </TouchableOpacity>
            </View>
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
    paddingTop: 5,
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
    height: 42,
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 14,     
    padding: 10,
    paddingLeft: 10, 
    paddingTop: 14,
  },
  firstName: {
    borderTopLeftRadius: 5,
    borderRightColor: '#ddd',
    borderRightWidth: 1
  },
  lastName: {
    borderTopRightRadius: 5,
    borderLeftWidth: 0
    
  },
  header: {
    fontSize: 15,
    marginBottom: 3,
    color: '#5b5b5b',
    fontFamily: 'HelveticaNeueLTStd-MdCn'
  },
  inputEmail: {
    height: 42,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 14,
    padding: 10,
    paddingLeft: 10,
    paddingTop: 14,
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  inputDescription: {
    height: 42,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa',
    fontSize: 14,
    padding: 10,
    paddingLeft: 10,
    paddingTop: 14,
  },
  areaContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  areaImage: {
    marginBottom: 5,

  },  
  areaContentTitle: {
    fontFamily: 'HelveticaNeueLTStd-Cn',
    fontSize: 11,
    flex: 1,
    alignItems: 'center',
    lineHeight: 10,
    paddingTop: 3,
    paddingHorizontal: 4,
    justifyContent: 'center',
    textAlign: 'center',
  },
  areaItem: {
    height: 80,
    width: 58,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    marginRight: 3
  },
  areaItemActive: {
    borderColor: '#f4002d',
    backgroundColor: '#fdeff1',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#f4002d',
    backgroundColor: '#fdeff1',
    borderRightColor: '#f4002d',
    borderRightWidth: 1
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    borderWidth: 0,
    width: '100%',
  //  backgroundColor: '#e31836',
    height: 38,
    justifyContent: 'center',
    padding: 10
  },
  button: {
    alignItems: 'center',
    flex: 1,
    //backgroundColor: '#d80024',
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0,
    width: '100%',
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