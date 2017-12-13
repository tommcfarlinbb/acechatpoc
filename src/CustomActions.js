import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Text,
  Image
} from 'react-native';

import Header from './components/Header';
import Modal from 'react-native-modal';

import CameraRollPicker from 'react-native-camera-roll-picker';

const images = {
  camera: require('./img/camera.png'),
};

export default class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this._images = [];
    this.state = {
      modalVisible: false,
      actionsVisible: false,
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

  // onActionsPress() {
  //   const options = ['Choose From Gallery','Cancel'];
  //   const cancelButtonIndex = options.length - 1;
  //   this.context.actionSheet().showActionSheetWithOptions({
  //     options,
  //     cancelButtonIndex,
  //   },
  //   (buttonIndex) => {
  //     console.log(buttonIndex)
  //     switch (buttonIndex) {
  //       case 0:
  //         // CHOSE FROM GALLERY
  //         this.setModalVisible(true);
  //         // navigator.geolocation.getCurrentPosition(
  //         //   (position) => {
  //         //     this.props.onSend({
  //         //       location: {
  //         //         latitude: position.coords.latitude,
  //         //         longitude: position.coords.longitude,
  //         //       },
  //         //     });
  //         //   },
  //         //   (error) => alert(error.message),
  //         //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  //         // );
  //         break;
  //       default:
  //     }
  //   });
  // }

  onActionsPress() {
    this.setState({ actionsVisible:true})
    return false;
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
  pressGallery = () => {
    this.setState({ actionsVisible:false})
    setTimeout( () => {
      this.setState({ modalVisible:true})
    },400)

  }
  renderActionsModal() {
    return (
      <Modal 
      style={{flex:1,margin:0,padding:10,justifyContent:'flex-end',alignItems:'center'}}
      isVisible={this.state.actionsVisible}
      backdropOpacity={.4}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      onBackdropPress={() => this.setState({ actionsVisible: false })}
    >
      <View style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%'
           // padding: 10
            //backgroundColor: '#fff'
      }}>        

          <TouchableWithoutFeedback 
            style={{width: '100%'}}
            onPress={this.pressGallery}
          >
            <View style={[styles.actionsButton,{marginBottom: 10}]}><Text style={styles.actionsText}>Choose From Gallery</Text></View>
          </TouchableWithoutFeedback>  
          <TouchableWithoutFeedback
            style={{width: '100%',}}
            onPress={() => {this.setState({ actionsVisible:false})}}
          >
            <View style={styles.actionsButton}><Text style={[styles.actionsText,{fontWeight:'bold'}]}>Cancel</Text></View>
          </TouchableWithoutFeedback>
      </View>
    </Modal>
    )
  }

  render() {
    return (
      <View>
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
      {this.renderActionsModal()}
      <Modal
        style={{flex:1,margin:0,padding:0,justifyContent:'flex-start',alignItems:'center'}}
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
          />
        <View style={{
          backgroundColor: '#fff',
          flex: 1,
          width: '100%'
        }}>
          <CameraRollPicker
            maximum={1}
            imagesPerRow={4}
            callback={this.selectImages}
            selected={[]}
          />
        </View>
      </Modal>
      </View> 
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
  actionsButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionsText: {
    color: '#007aff',
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
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
