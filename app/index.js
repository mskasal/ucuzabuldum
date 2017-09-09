'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  AsyncStorage,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import { Icon } from 'react-native-elements'

import Camera from 'react-native-camera';
import RNGooglePlaces from 'react-native-google-places';

import AuthBackdropLogin from './components/AuthBackdropLogin';
import Profile from './components/Profile';
import ProfileSettings from './components/ProfileSettings';
import Tweet from './components/Tweet';

const initialState = {
  credentials: null,
  showProfile: false,
  currentLocation: {
    name: 'Yer seç..'
  },
  tweetData: {
    image: {
      path: null
    }
  },
  showTweet: false
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  componentWillMount() {
    this.checkIfUserHaveCredentials();
  }
  onProfilePress() {
    this.revealProfile();
  }
  revealProfile() {
    this.setState({
      showProfile: true
    });
  }
  onLogout() {
    this.checkIfUserHaveCredentials()
      .then(() => {
        this.setState({
          showProfile: false
        });
      });
  }
  onCancel() {
    this.setState({
      showProfile: false
    });
  }
  checkIfUserHaveCredentials() {
    return AsyncStorage.getItem('credentials')
      .then((response) => {
        const credentials = JSON.parse(response);
        this.setState({ credentials })
      });
  }
  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({ metadata: options })
      .then((data) => {
        this.openTweetView(data);
      })
      .catch(err => console.error(err));
  }
  openTweetView(data) {
    this.setState({ tweetData: {image: {...data}} }, () => {
      this.setState({ showTweet: true });
    });
  }
  openSearchModal() {
    navigator.geolocation.getCurrentPosition((response) => {
      RNGooglePlaces.openAutocompleteModal({
        country: 'tr',
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
        radius: 0.1,
        type: 'establishment',
        useOverlay: true
      })
        .then((place) => {
          this.setState({
            currentLocation: place
          });
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
    });
  }
  onTwitBack(){
    this.setState({ showTweet: false });
    this.setState({ tweetData: { image: { path: null } } });
  }
  onBarCodeRead(data) {
    console.log(data);
  }
  render() {
    const { showTweet, tweetData: {image: { path, mediaUri }}, credentials, showProfile, currentLocation: { name }, currentLocation } = this.state;
    return (
      <View style={styles.container}>
        <AuthBackdropLogin
          onAuthSuccess={() => this.checkIfUserHaveCredentials()}
          credentials={credentials}
        />
        <Profile
          style={styles.profile}
          imageStyle={styles.profileImageStyle}
          credentials={credentials || schemeCredentials}
          onPress={() => this.onProfilePress(credentials)}
        />
        <ProfileSettings
          onLogout={() => this.onLogout()}
          onCancel={() => this.onCancel()}
          credentials={credentials || schemeCredentials}
          showMe={showProfile}
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={() => this.onBarCodeRead(data)}
        >
          <Icon
              color={'#fff'}
              size={46}
              style={styles.capture}
              name={'camera'}
              onPress={this.takePicture.bind(this)}
          />
          <TouchableOpacity style={styles.border}>
            <Text>[</Text>
            <Text>]</Text>
          </TouchableOpacity>
        </Camera>
        <TouchableOpacity
          style={styles.pinStyle}
          onPress={() => this.openSearchModal()}
        >
          <Image
            style={styles.pinImage}
            source={require('./assets/images/pin.png')}
          />
          {
            (name) ? <Text style={styles.locationText}>{name}</Text> : <View/>
          }
        </TouchableOpacity>
        {
          (showTweet && path) ? <Tweet
                                  onBackPressed={() => this.onTwitBack()}
                                  credentials={credentials}
                                  imageData={path}
                                  imageUri={mediaUri}
                                  location={currentLocation}
                                  /> : <View/>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    margin: 40,
    borderRadius: 23
  },
  profile: {
    alignSelf: 'flex-end',
    bottom: 40,
    left: 20,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 25
  },
  profileImageStyle: {
    borderRadius: 25,
    width: 50,
    height: 50
  },
  pinStyle: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  locationText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  pinImage: {
    width: 28,
    height: 37
  },
  border: {
    color: 'white',
    fontSize: 30,
    position: 'absolute',
    backgroundColor: 'transparent',
  }
});

const schemeCredentials = {
  user: { name: '', profile_image_url: ''}
};

AppRegistry.registerComponent('ucuzabuldum', () => App);
