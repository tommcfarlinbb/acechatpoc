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
