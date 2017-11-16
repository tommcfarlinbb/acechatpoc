import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';


export default class NewChat extends Component {
  static navigatorStyle = {
    navBarTextColor: '#f4002d',
    navBarTextFontSize: 18,
    navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
  };
  constructor(props) {
    super(props);
    this.state = {
      area: null,
      firstName: null,
      lastName: null,
      email: null,
      description: null,
      customerId: this.props.customerId || null
    }
    this.sdk = this.props.sdk;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

  }
  onNavigatorEvent(event) { 
    console.log(event)
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'close') { 
        this.props.navigator.dismissModal();
      }
    }
  }
  beginChat = () => {
 //   const subtitle = this.state.description.toUpperCase();
    this.props.navigator.push({
      screen: 'ChatIOsdk',
      title: 'Rick\'s Ace Hardware',
      passProps: {
        area: this.state.area,
        name: this.state.firstName + ' ' + this.state.lastName,
        email: this.state.email,
        description: this.state.description,
        sdk: this.sdk,
        customerId: this.state.customerId,
        title: 'Rick\'s Ace Hardware',
        subtitle: this.state.description,
      },
      navigatorButtons: {
        leftButtons: [{
          id: 'close',
          disableIconTint: true,
          icon: require('../img/back_icn.png')
        }],
        rightButtons: [{
          id: 'end',
          title: 'End Chat',
          buttonColor: '#5b5b5b',
          buttonFontSize: 16,
          buttonFontFamily: 'HelveticaNeue-CondensedBold'

        }]
      }
    });
  }
  pressArea = (area) => {
    this.setState({
      area: area
    })
  }
  render() {
    let areas = [
      { name: 'Plumbing', icon: '' },
      { name: 'Lawn', icon: '' },
      { name: 'Painting', icon: '' },
      { name: 'Outdoors', icon: '' },
      { name: 'Hardware', icon: '' },
      { name: 'Auto', icon: '' },
      { name: 'Tools', icon: '' },
      { name: 'Indoors', icon: '' },
      { name: 'Other', icon: '' }
    ];
    let areaList = areas.map((area,idx) => {
      return (
        <TouchableWithoutFeedback key={idx} onPress={() => this.pressArea(area.name)}>
          <View style={[styles.areaItem, this.state.area === area.name && styles.areaItemActive]}>
            <View style={styles.areaContent}><Text style={styles.areaContentTitle}>{area.name}</Text></View>
          </View>
        </TouchableWithoutFeedback>
      );
    })
    return (
      <View style={styles.container}>
        <View style={{flex: 1,width:'100%'}}>

            <View style={{padding:15,paddingBottom:0}}>
              <Text style={styles.header}>Contact Information</Text>
              <View style={{
                flexDirection: 'row',
              }}>
                <TextInput style={[styles.input,styles.firstName]} onChangeText={text => this.setState({firstName: text})} autoCorrect={false}  placeholder="First Name" />
                <TextInput style={[styles.input,styles.lastName]} onChangeText={text => this.setState({lastName: text})} autoCorrect={false} placeholder="Last Name" />
              </View>
            </View>
            <View style={{paddingLeft:15,paddingRight:15,marginBottom: 10}}>
              <TextInput style={styles.inputEmail} onChangeText={text => this.setState({email: text})} autoCorrect={false} autoCapitalize="none" placeholder="Email Address" />
            </View>

            <View style={{padding:15,paddingBottom:0,height: 200}}>
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
                <TextInput style={styles.inputDescription} onChangeText={text => this.setState({description: text})}  placeholder="Description (40 characters)" />
              </View>
            </View>

        </View>
       
        <View style={{padding: 10,backgroundColor:'#fff',width:'100%',alignItems:'center'}}>
          <TouchableOpacity
              style={styles.button}
              onPress={this.beginChat}
            >
              <Text style={styles.buttonText}>BEGIN CHAT</Text>
            </TouchableOpacity>
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
  input: {
    height: 45,
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 14,
    paddingLeft: 15,
    padding: 10,
    fontFamily: 'HelveticaNeue-CondensedBold'
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
    fontSize: 15,
    marginBottom: 8,
    fontFamily: 'HelveticaNeue-CondensedBold'
  },
  inputEmail: {
    height: 45,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#aaa',
    fontSize: 14,
    padding: 10,
    paddingLeft: 15,
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    fontFamily: 'HelveticaNeue-CondensedBold'
  },
  inputDescription: {
    height: 45,
    backgroundColor: '#fff',
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa',
    fontSize: 14,
    padding: 10,
    paddingLeft: 15,
    fontFamily: 'HelveticaNeue-CondensedBold'
  },
  areaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  areaContentTitle: {
    fontFamily: 'HelveticaNeue-CondensedBold',
    fontSize: 11
  },
  areaItem: {
    height: 70,
    width: 60,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    marginRight: 8
  },
  areaItemActive: {
    borderColor: '#f4002d',
    backgroundColor: '#fdeff1',
    borderWidth: 2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#d80024',
    borderRadius: 5,
    borderWidth: 0,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    padding: 10
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'HelveticaNeue-CondensedBold'
  }
});