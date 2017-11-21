import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthWebView } from '@livechat/chat.io-customer-auth';
import { init } from '@livechat/chat.io-customer-sdk'

export default class App extends React.Component {
  componentDidMount() {
    const sdk = init({ license: 100004225 })
    sdk.on('connected', ({ chatsSummary, totalChats }) => {
      console.log('on connected', { chatsSummary, totalChats })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <AuthWebView license={100004225} env={"labs"}/>
        <Text>Loading</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});