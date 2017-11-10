
import { Navigation } from 'react-native-navigation';

import Types from './NavigationTypes';
import Actions from './Actions';
import Chat from './Chat';
import ChatIO from './ChatIO';
import NewChat from './NewChat';
import Home from './Home';
import AllChats from './AllChats';

export function registerScreens(store,Provider) {
    Navigation.registerComponent('example.Types', () => Types);
    Navigation.registerComponent('example.Actions', () => Actions);
    Navigation.registerComponent('NewChat', () => NewChat);
    Navigation.registerComponent('Chat', () => Chat);
    Navigation.registerComponent('AllChats', () => AllChats);
    Navigation.registerComponent('ChatIO', () => ChatIO);
    Navigation.registerComponent('Home', () => Home, store, Provider);
}
