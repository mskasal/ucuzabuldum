import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions
} from 'react-native';

import twitter from 'react-native-twitter';
import RNFS from 'react-native-fs';

import { Button } from 'react-native-elements';
const tokens = {
  consumerKey: 'RlmLlkjDImFlOYyhKwRuZb2QB',
  consumerSecret: 'AX2BmdDOc7vnPsJKFTg4FmKejdr1KOIKOBJj6Q5qVxbsvozZUS',
  accessToken: '812236417455812608-uwWjSXwGZwwPl1LVh6leVSiju1PhZ1z',
  accessTokenSecret: 'eSQt5RzdxP5vSV4Ld0E9MZp4uZHB5LuMMUddLT1T3bstG',
};
class TweetIt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showTwitAddress: false,
      twitter: twitter(tokens)
    }
  }
  sendTweet(tweetText, imageData) {
    const imagePostUrl = 'https://upload.twitter.com/1.1/media/upload';
    const { twitter } = this.state;
    const { location: { placeID }, onBackPressed } = this.props;
    RNFS.readFile(imageData.substring(7), "base64").then((res) => {
      twitter.rest.post(imagePostUrl, {media: res}).then((responseData) => {
        const { media_id_string } = responseData;
        const statusUrl = 'https://api.twitter.com/1.1/statuses/update';
        twitter.rest.post(statusUrl, { status: tweetText, media_ids: media_id_string, place_id: placeID }).then(() => {
          onBackPressed();
        }).catch((e) => {
          console.log(e);
        });
      }).catch((e) => {
        console.log(e);
      });
    });
  }
  render() {
    const { onBackPressed, imageData, imageUri, credentials: { user: { screen_name } }, location } = this.props;
    const tweetText = `${location.name}'da #ucuzabuldum, ${location.address.split(',').slice(0,2).join(' ')} +||+ @${screen_name}`;
    return (
      <View style={styles.container}>
        <Text style={styles.tweetText}>{tweetText}</Text>
        <Image style={styles.tweetImage} source={{uri: imageUri}} />
        <Button
          large
          iconRight
          icon={{name: 'twitter', type: 'font-awesome'}}
          title='Tweetle gitsin..'
          onPress={() => this.sendTweet(tweetText, imageData, imageUri)}
          buttonStyle={styles.tweetButton}
        />
        {/*<Text style={styles.tweetSmallText}>But Tweet @ucuzabuldum hesabında yayınlanacaktır!*/}
          {/*Kendi hesabınızda yayınlanmasını istiyorsanız lütfen Retweet butonuna basınız.</Text>*/}
        {/*<Button*/}
          {/*small*/}
          {/*icon={{name: 'retweet', type: 'font-awesome'}}*/}
          {/*title='Retweet'*/}
          {/*onPress={() => this.sendTweet()}*/}
          {/*buttonStyle={styles.retweetButton}*/}
        {/*/>*/}
        {
          (this.state.showTwitAddress) ? <Text style={styles.tweetSmallText}>{this.state.tweetAdress}</Text> : <View/>
        }
        <Button
          small
          icon={{name: 'angle-left', type: 'font-awesome'}}
          title='Geri dön'
          onPress={onBackPressed}
          buttonStyle={styles.backButton}
        />
      </View>
    );
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
    zIndex: 999999,
    opacity: .9
  },
  tweetImage: {
    width,
    height: 300
  },
  tweetText: {
    fontSize: 14,
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center'
  },
  tweetSmallText: {
    color: 'white',
    fontSize: 10,
    marginTop: 20,
    textAlign: 'center'
  },
  tweetButton: {
    width,
    backgroundColor: '#1DA1F2',
    alignSelf: 'center'
  },
  backButton: {
    width,
    backgroundColor: '#BE2127',
    alignSelf: 'center'
  },
  retweetButton: {
    backgroundColor: '#1DA1a2',
    marginTop: 50,
    width: 140,
    alignSelf: 'center'
  }
};

export default TweetIt;