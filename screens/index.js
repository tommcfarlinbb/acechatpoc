
import { Navigation } from 'react-native-navigation';

import Types from './NavigationTypes';
import Actions from './Actions';
 import Chat from './Chat';
 import NewChat from './NewChat';
 import Home from './Home';

export function registerScreens() {
    Navigation.registerComponent('example.Types', () => Types);
    Navigation.registerComponent('example.Actions', () => Actions);
    Navigation.registerComponent('NewChat', () => NewChat);
     Navigation.registerComponent('Chat', () => Chat);
     Navigation.registerComponent('Home', () => Home);
}
