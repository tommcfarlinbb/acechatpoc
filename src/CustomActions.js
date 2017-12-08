import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
  Image
} from 'react-native';

import Header from './components/Header';
import Modal from 'react-native-modal';

import CameraRollPicker from 'react-native-camera-roll-picker';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

const images = {
  camera: require('./img/camera.png'),
};

export default class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this._images = [];
    this.state = {
      modalVisible: false,
    };
    this.onActionsPress = this.onActionsPress.bind(this);
    this.selectImages = this.selectImages.bind(this);
  }

  setImages(images) {
    this._images = images;
  }

  getImages() {
    return this._images;
  }

  setModalVisible(visible = false) {
    this.setState({modalVisible: visible});
  }

  onActionsPress() {
    const options = ['Choose From Gallery','Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      console.log(buttonIndex)
      switch (buttonIndex) {
        case 0:
          // CHOSE FROM GALLERY
          this.setModalVisible(true);
          // navigator.geolocation.getCurrentPosition(
          //   (position) => {
          //     this.props.onSend({
          //       location: {
          //         latitude: position.coords.latitude,
          //         longitude: position.coords.longitude,
          //       },
          //     });
          //   },
          //   (error) => alert(error.message),
          //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          // );
          break;
        default:
      }
    });
  }

  selectImages(images) {
    this.setImages(images);
  }

  renderNavBar() {
    return (
      <NavBar style={{
        statusBar: {
          backgroundColor: '#FFF',
        },
        navBar: {
          backgroundColor: '#FFF',
          paddingTop: 8,
          paddingLeft: 14,
          paddingRight: 14

        },
      }}>
        <NavButton onPress={() => {
          this.setModalVisible(false);
        }}>
          <NavButtonText style={{
            paddingTop: 3,
            color: '#000',
            fontSize: 14,
            fontFamily: 'HelveticaNeueLTStd-MdCn',
          }}>
            {'Cancel'}
          </NavButtonText>
        </NavButton>
        <NavTitle style={{
          fontFamily: 'HelveticaNeue-CondensedBold',
          color: '#d80024',
          fontSize: 18,          
        }}>
          {'CAMERA ROLL'}
        </NavTitle>
        <NavButton onPress={() => {
          this.setModalVisible(false);

          const images = this.getImages().map((image) => {
            return {
              filename: image.filename,
              uri: image.uri,
            };
          });
          console.log(images)
          this.props.onImageSend(images);
          this.setImages([]);
        }}>
          <NavButtonText style={{
            paddingTop: 3,
            color: '#000',
            fontSize: 14,
            fontFamily: 'HelveticaNeueLTStd-MdCn',
          }}>
            {'Send'}
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }

  sendImage = () => {
    this.setModalVisible(false);
    
    const images = this.getImages().map((image) => {
      return {
        filename: image.filename,
        uri: image.uri,
      };
    });
    console.log(images)
    this.props.onImageSend(images);
    this.setImages([]);
  }
  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View
        style={[styles.wrapper, this.props.wrapperStyle]}
      >
       <Image style={{height: 17,width: 22}} source={images.camera} />
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.onActionsPress}
      >
        <Modal
          style={{flex:1,margin:0,padding:0,justifyContent:'center',alignItems:'center'}}
          isVisible={this.state.modalVisible}
          animationInTiming={400}
          animationOutTiming={400}
          backdropTransitionInTiming={1}
          backdropTransitionOutTiming={1}
          backdropOpacity={0}
        >
          <Header 
          left="close" 
          onPressLeft={() => {this.setModalVisible(false)}}
          right="Send" 
          onPressRight={this.sendImage}
          title={'Camera Roll'}
          padHeader={true}  />

          <CameraRollPicker
            maximum={1}
            imagesPerRow={4}
            callback={this.selectImages}
            selected={[]}
          />
        </Modal>
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
  onSend: () => {},
  onImageSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  onImageSend: PropTypes.func,
  options: PropTypes.object,
  icon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};
