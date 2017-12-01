import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

const images = {
  close: require('../img/close_icn.png'),
  back: require('../img/back_icn.png'),
  end: require('../img/end-chat.png')
};
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    
  }

  renderLeftBtn() {
    if (this.props.left) {
      return (
        <TouchableOpacity
          style={{width:58,marginLeft:12}}
          onPress={this.props.onPressLeft}
          ><Image style={{marginBottom:8}} source={images[this.props.left]} />
        </TouchableOpacity>
      );
    }
    return <View style={{width:58, marginLeft:12}} />;
  }
  renderRightBtn() {
    if (this.props.right) {
      return (
        <TouchableOpacity
          style={{width:58,marginRight:12}}
          onPress={this.props.onPressRight}
          ><Image style={{marginBottom:8}} source={images[this.props.right]} />
        </TouchableOpacity>
      );
    }
    return <View style={{width:58,marginRight:12}} />;
  }
  renderMiddle() {
    if (this.props.storeTitle) {
      return (
        <View style={{flex: 1,}}>
        <Text numberOfLines={1} style={styles.titleSmall}>{this.props.storeTitle}</Text>
        <Text numberOfLines={1} style={styles.titleMedium}>{this.props.title.toUpperCase()}</Text>
        </View>
      )
    }
    return (
      <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLeftBtn()}
        {this.renderMiddle()}        
        {this.renderRightBtn()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 63,
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3'
  },
  titleSmall: {
    color: '#000',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'HelveticaNeueLTStd-Cn'
  },
  titleMedium: {
    color: '#f4002d',
    fontSize: 15,
    fontFamily: 'HelveticaNeueLTStd-BdCn',
    textAlign: 'center'
  },
  title: {
    color: '#f4002d',
    fontSize: 18,
    flex: 1,
    paddingBottom: 1,
    fontFamily: 'HelveticaNeueLTStd-BdCn',
    textAlign: 'center'
  }
});