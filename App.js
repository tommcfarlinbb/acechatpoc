import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';


// screen related book keeping
registerScreens();

const tabs = [{
  label: 'Navigation',
  screen: 'example.Types',
  icon: require('./img/list.png'),
  title: 'Navigation Types',
}, {
  label: 'Actions',
  screen: 'example.Actions',
  icon: require('./img/list.png'),
  title: 'Navigation Actions',
}];

Navigation.startSingleScreenApp({
  screen: {
    screen: 'Home',
    title: 'Home',
    navigatorStyle: {},
    navigatorButtons: {}
  }
});

// this will start our app
// Navigation.startTabBasedApp({
//   tabs,
//   animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
//   tabsStyle: {
//     tabBarBackgroundColor: '#003a66',
//     tabBarButtonColor: '#ffffff',
//     tabBarSelectedButtonColor: '#ff505c',
//     tabFontFamily: 'BioRhyme-Bold',
//   },
//   appStyle: {
//     tabBarBackgroundColor: '#003a66',
//     navBarButtonColor: '#ffffff',
//     tabBarButtonColor: '#ffffff',
//     navBarTextColor: '#ffffff',
//     tabBarSelectedButtonColor: '#ff505c',
//     navigationBarColor: '#003a66',
//     navBarBackgroundColor: '#003a66',
//     statusBarColor: '#002b4c',
//     tabFontFamily: 'BioRhyme-Bold',
//   }
// });