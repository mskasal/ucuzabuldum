import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  AsyncStorage
} from 'react-native';
import { twitter } from 'react-native-simple-auth';

class AuthBackdropLogin extends Component {
  constructor(props) {
    super(props);
  }
  login() {
    twitter(credentials)
      .then((response) => {
        this.saveCredentialsToStorage(response).then(() => {
          this.props.onAuthSuccess();
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }
  saveCredentialsToStorage(response) {
    return AsyncStorage.setItem('credentials', JSON.stringify(response));
  }
  render() {
    const { credentials } = this.props;
    return (!credentials) ? (
          <View style={styles.backdrop}>
            <TouchableOpacity onPress={() => this.login()}>
              <Text style={styles.text}>#Ucuzabuldum</Text>
              <Image style={styles.twitter} source={require('../assets/images/twitter.png')} />
            </TouchableOpacity>
          </View>) : (<View />);
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  backdrop: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width,
    height,
    position: 'absolute',
    backgroundColor: 'black',
    opacity: .67,
    zIndex: 999999
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30
  },
  twitter: {
    marginTop: 70,
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: 'auto'
  }
});

const credentials = {
  appId: 'RlmLlkjDImFlOYyhKwRuZb2QB',
  appSecret: 'AX2BmdDOc7vnPsJKFTg4FmKejdr1KOIKOBJj6Q5qVxbsvozZUS',
  callback: 'com.ucuzabuldum://authorize',
};

export default AuthBackdropLogin;