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
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';

const store = configureStore();
registerScreens(store, Provider);
// screen related book keeping
//registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'Home',
    title: 'CHAT',
    navigatorStyle: {
      navBarTextColor: '#f4002d',
      navBarTextFontSize: 18,
      navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
    },
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