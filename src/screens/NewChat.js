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
  paint: require('../img/paint.png'),
  outdoors: require('../img/outdoors.png'),
  hardware: require('../img/hardware.png'),
  auto: require('../img/auto.png'),
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
      firstName: 'Brand',
      lastName: 'McBranderson',
      email: 'brander@bb.com',
      description: null,
      customerId: this.props.navigation.state.params.customerId || null
    }
    this.sdk = this.props.navigation.state.params.sdk;
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
    this.props.navigation.state.params.callback({
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
    this.props.navigation.goBack();

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
  render() {
    let areas = [
      { name: 'Plumbing', icon: 'plumbing_icn' },
      { name: 'Lawn', icon: 'lawn' },
      { name: 'Painting', icon: 'paint' },
      { name: 'Outdoors', icon: 'outdoors' },
      { name: 'Hardware', icon: 'hardware' },
      { name: 'Auto', icon: 'auto' },
      { name: 'Tools', icon: 'tools' },
      { name: 'Indoors', icon: 'indoor' },
      { name: 'Other', icon: 'other' }
    ];
    let areaList = areas.map((area,idx) => {
      return (
        <TouchableWithoutFeedback key={idx} onPress={() => this.pressArea(area.name)}>
          <View style={[styles.areaItem, this.state.area === area.name && styles.areaItemActive]}>
            <View style={styles.areaContent}>
              <Image style={styles.areaImage} source={images[area.icon]} />
              <Text style={styles.areaContentTitle}>{area.name}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    })
    return (
      <View style={styles.RNcontainer}>
        <Header 
          navigation={this.props.navigation} 
          left="close" 
          onPressLeft={() => this.props.navigation.goBack()}
          title="NEW ISSUE" />
        <View style={{
          flex: 1,
          backgroundColor: '#eee6d9',
          width:'100%'
        }}>
          
          <View style={styles.container}>
            <View style={{flex: 1,width:'100%'}}>
                <View style={{padding:15,paddingBottom:0}}>
                  <Text style={styles.header}>Contact Information</Text>
                  <View style={{
                    flexDirection: 'row',
                  }}>
                    <TextInput style={[Common.fontRegular,styles.input,styles.firstName]} onChangeText={text => this.setState({firstName: text})} value={this.state.firstName} autoCorrect={false}  placeholder="First Name *" />
                    <TextInput style={[Common.fontRegular,styles.input,styles.lastName]} onChangeText={text => this.setState({lastName: text})} value={this.state.lastName} autoCorrect={false} placeholder="Last Name *" />
                  </View>
                </View>
                <View style={{paddingLeft:15,paddingRight:15,marginBottom: 10}}>
                  <TextInput style={[Common.fontRegular,styles.inputEmail]} onChangeText={text => this.setState({email: text})} value={this.state.email} autoCorrect={false} autoCapitalize="none" placeholder="Email *" />
                </View>

                <View style={{padding:15,paddingBottom:0,height: 220}}>
                  <Text style={styles.header}>What area do you need assitance?</Text>
                  <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    flexWrap: 'wrap',                
                    justifyContent: 'flex-start'
                  }}>
                    { areaList }
                  </View>
                </View>


                <View style={{padding:15,paddingBottom:0}}>
                  <Text style={styles.header}>Please provide a brief description</Text>
                  <View>
                    <TextInput style={[Common.fontRegular,styles.inputDescription]} onChangeText={text => this.setState({description: text})}  placeholder="Description (40 characters)" />
                  </View>
                </View>

            </View>
          
            <View style={{padding: 10,height:60,backgroundColor:'#fff',width:'100%',alignItems:'center'}}>
              <TouchableOpacity
                  style={styles.button}
                  onPress={this.beginChat}
                >
                <LinearGradient colors={['#e21836', '#b11226']} style={styles.linearGradient}>
                  <Text style={styles.buttonText}>BEGIN CHAT</Text>
                </LinearGradient>
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
    paddingTop: 20,
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
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    height: 40,
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