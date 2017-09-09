import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity
} from 'react-native';

class Profile extends Component {
  render() {
    const { imageStyle, style, onPress, credentials: { user: { name, profile_image_url} } } = this.props;
    return (name) ? (
      <TouchableOpacity
        onPress={onPress}
        style={style}
      >
        <Image
          style={imageStyle}
          defaultSource={require('../assets/images/profile.png')}
          source={{uri: profile_image_url}}
        />
        {/*<Text style={styles.text}>{name || '...'}</Text>*/}
      </TouchableOpacity>
    ) : <View/>;
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'transparent'
  }
});

export default Profile;