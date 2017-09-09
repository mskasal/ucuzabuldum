import React, { Component } from 'react';
import {
  View,
  Button,
  AsyncStorage,
  Dimensions
} from 'react-native';

import Profile from './Profile';

class ProfileSettings extends Component {
  constructor(props) {
    super(props);
  }
  logout() {
    AsyncStorage.clear().then(() => {
      this.props.onLogout();
    });
  }
  cancel() {
    this.props.onCancel();
  }
  render() {
    const { credentials, showMe } = this.props;
    return (showMe) ? (
      <View style={styles.container}>
        <View style={styles.innerContent}>
          <Profile
            style={styles.profile}
            imageStyle={styles.profileImageStyle}
            credentials={credentials || schemeCredentials}
          />
          <Button
            title="OTURUMU KAPAT"
            color="#841584"
            onPress={() => this.logout()}
            style={styles.button}
          />
          <Button
            title="GERİ DÖN"
            color="#BE2127"
            onPress={() => this.cancel()}
            style={styles.button}
          />
        </View>
      </View>
    ) : <View/>;
  }
}

const { height, width } = Dimensions.get('window');

const styles = {
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width,
    height,
    position: 'absolute',
    backgroundColor: 'black',
    zIndex: 999999
  },
  innerContent: {
    flexDirection: 'column',
    width,
    height
  },
  profile: {
    flex: 0,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  profileImageStyle: {
    borderRadius: 50,
    width: 80,
    height: 80
  },
  button: {
    height: 55,
    marginTop: 400
  }
};

export default ProfileSettings;
