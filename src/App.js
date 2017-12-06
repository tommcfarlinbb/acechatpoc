import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Button,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

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
  });

  return ModalStackNavigator;
};

const RootNavigator = StackNavigator({
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
