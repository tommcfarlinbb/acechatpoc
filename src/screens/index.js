
//import { Navigation } from 'react-native-navigation';
import React, { Component } from 'react';
import {StyleSheet, Image,TouchableOpacity, View, Text} from 'react-native';


//  import ChatIOsdk from './ChatIOsdk';
//  import NewChat from './NewChat';
 import Home from './Home';
//  import Details from './Details';
//  import Something from './Something';
 //import Header from './Header';
 //import ThumbsModal from './ThumbsModal';

// import Availability from './Availability';

export default {
  RootNavigator: Home
  // details: Details,
  // newChat: NewChat,
  // something: Something,
  // chat: ChatIOsdk,
  // availability: Availability
};

//  const images = {
//     thumbs: require('../img/thumbs.png')
//   }
//  const CustomButton = ({ text }) =>
//  <TouchableOpacity
//    style={[styles.button, { marginLeft:-10 }]}
//    onPress={() => {
//        Navigation.showLightBox({
//         screen: "ThumbsModal", // unique ID registered with Navigation.registerScreen
//         passProps: {
            
//         }, // simple serializable object that will pass as props to the lightbox (optional)
//         style: {
//           backgroundBlur: "none", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
//           backgroundColor: "rgba(0,0,0,.5)", // tint color for the background, you can specify alpha here (optional)
//           tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
//         }
//       });
//    }}
//  >
//    <View style={styles.button}>
//      <Image style={{width: 30,height: 24}} source={images.thumbs} />
//    </View>
//  </TouchableOpacity>;

// const styles = StyleSheet.create({
//     button: {
//       overflow: 'hidden',
//       width: 34,
//       height: 34,
//       borderRadius: 34 / 2,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//   });
// export function registerScreens(store,Provider) {
    
//     Navigation.registerComponent('Header', () => Header);    
//     Navigation.registerComponent('NewChat', () => NewChat);
//   //  Navigation.registerComponent('Chat', () => Chat);
//  //   Navigation.registerComponent('Test', () => Test);    
//   //  Navigation.registerComponent('ChatIO', () => ChatIO);
//   Navigation.registerComponent('ThumbsModal', () => ThumbsModal);
//     Navigation.registerComponent('ChatIOsdk', () => ChatIOsdk);
//     Navigation.registerComponent('Availability', () => Availability);
//     Navigation.registerComponent('Home', () => Home);
//   //  Navigation.registerComponent('Home', () => Home, store, Provider);
//   //  Navigation.registerComponent('CustomButton', () => CustomButton);
// }


