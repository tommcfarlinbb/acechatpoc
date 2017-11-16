
import { Navigation } from 'react-native-navigation';

import Types from './NavigationTypes';
import Actions from './Actions';
//import Chat from './Chat';
//import ChatIO from './ChatIO';
import ChatIOsdk from './ChatIOsdk';
import NewChat from './NewChat';
import Home from './Home';
import Header from './Header';
import Test from './Test';
import AllChats from './AllChats';

export function registerScreens(store,Provider) {
    Navigation.registerComponent('example.Types', () => Types);
    Navigation.registerComponent('Header', () => Header);
    Navigation.registerComponent('example.Actions', () => Actions);
    Navigation.registerComponent('NewChat', () => NewChat);
  //  Navigation.registerComponent('Chat', () => Chat);
    Navigation.registerComponent('Test', () => Test);
    Navigation.registerComponent('AllChats', () => AllChats);
  //  Navigation.registerComponent('ChatIO', () => ChatIO);
    Navigation.registerComponent('ChatIOsdk', () => ChatIOsdk);
    Navigation.registerComponent('Home', () => Home, store, Provider);
}
