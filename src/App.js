import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Button,
  View
} from 'react-native';

// import { Navigation } from 'react-native-navigation';
// import { registerScreens } from './screens';
// import configureStore from './store/configureStore';
// import { Provider } from 'react-redux';

//const store = configureStore();
//registerScreens(store, Provider);

// Navigation.startSingleScreenApp({
//   screen: {
//     screen: 'Home',
//     title: 'CHAT',
//     navigatorStyle: {
//       navBarTextColor: '#f4002d',
//       navBarTextFontSize: 18,
//       navBarTextFontFamily: 'HelveticaNeue-CondensedBold'
//     },
//     navigatorButtons: {}
//   }
// });
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.14

import screens from './screens';

const StackModalNavigator = (routeConfigs, navigatorConfig) => {
  const CardStackNavigator = StackNavigator(routeConfigs, navigatorConfig);
  const modalRouteConfig = {};
  const routeNames = Object.keys(routeConfigs);

  for (let i = 0; i < routeNames.length; i++) {
    modalRouteConfig[`${routeNames[i]}Modal`] = routeConfigs[routeNames[i]];
  }

  const ModalStackNavigator = StackNavigator({
    CardStackNavigator: { screen: CardStackNavigator },
    ...modalRouteConfig
  }, {
    mode: 'modal',
    headerMode: 'none',
    // transitionConfig: () => ({
    //   transitionSpec: {
    //     duration: 0,
    //   },
    // })


  });

  return ModalStackNavigator;
};

const RootNavigator = StackModalNavigator({
  Home: {
    screen: screens.home
  },
  Availability: {
    screen: screens.availability
  },
  Details: {
    screen: screens.details
  },
  Something: {
    screen: screens.something
  },
  NewChat: {
    screen: screens.newChat
  },
  Chat: {
    screen: screens.chat
  },

}, {
  headerMode: 'none'
});

// const RootNavigator = StackNavigator({
//   Home: {
//     screen: screens.home,
//     navigationOptions: {
//       headerTitle: 'Home',
//     },
//   },
//   Details: {
//     screen: screens.details,
//     navigationOptions: {
//       headerTitle: 'Details',
//     },
//   },
// });

export default RootNavigator;
