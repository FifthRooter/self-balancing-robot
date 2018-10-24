import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { WebBrowser } from 'expo';
import { Button, Provider as PaperProvider } from 'react-native-paper'
import { MonoText } from '../components/StyledText';
//import {subscribeToTimer, updateGainz } from '../api.js'
import ChangeText from '../ChangeText.js'
import openSocket from 'socket.io-client';

const socket = openSocket('http://192.168.178.39:8000');




export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  //
  // state = {
  //   timestamp: 'no timestamp yet',
  //   isConnected: false,
  //   data: null
  // }
  //
  // robot = {
  //   motorState: true,
  //   gains: {
  //     Kp: 14,
  //     Kd: 0.03,
  //     Ki: 4
  //   }
  // }

  constructor(props) {
    super(props)
    this.state = {
      appText: 'Hallo',
      timestamp: 'no timestamp',
      isConnected: false,
      data: null,
      val: '2',
      motorState: true,
      robot: {
        gains: {
          Kp: 15,
          Kd: 0.03,
          Ki: 4,
        }
      }
    }
  }

  writeText = text => {
    this.setState({
        appText: text
    })
  }

    // state = {
    //   appText: 'Hallo',
    //   timestamp: 'no timestamp',
    //   isConnected: false,
    //   data: null,
    //   val: '2',
    //   motorState: true,
    //   robot: {
    //     gains: {
    //       Kp: 15,
    //       Kd: 0.03,
    //       Ki: 4,
    //     }
    //   }
    // }




    toggleMotors = () => {
      socket.emit('toggleMotors')
    }

    submitKp = () => {
      socket.emit('updateKp', this.state.robot.gains.Kp)
    }

    submitKd = () => {
      socket.emit('updateKd', this.state.robot.gains.Kd)
    }

    submitKi = () => {
      socket.emit('updateKi', this.state.robot.gains.Ki)
    }

    subscribeToTimer = (err, timestamp) => {this.setState({
      timestamp
    })}


  componentDidMount() {

    //socket.emit("getSomeData",{data: "some random data"});

    // socket.on('connect', () => {
    //   this.setState({ isConnected: true });
    //   console.log('connected to server')
    //
    // });
    //
    // socket.emit('motorState', () => {
    //   console.log('Woops')
    // })
 }

  render() {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/robot-dev.png')
                    : require('../assets/images/robot-prod.png')
                }
                style={styles.welcomeImage}
              />
            </View>

            <View style={styles.getStartedContainer}>
              {this._maybeRenderDevelopmentModeWarning()}

              <Text style={styles.getStartedText}>Get started by opening</Text>

              <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
              </View>

              <Text style={styles.getStartedText}>
                Connected: {this.state.motorState ? 'true' : 'false'}
              </Text>
              <Text>
                This is the timer value: {this.state.timestamp}
              </Text>
              <Button icon='ac-unit' mode='outlined' onPress={this.toggleMotors}>Motor</Button>

            </View>

            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
              <View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.getStartedText}>Kp = {this.state.robot.gains.Kp}</Text>
                  <TextInput
                    style={{height:40, width:100, paddingHorizontal:20, marginVertical:10, marginHorizontal:15, borderColor: 'brown', borderWidth: 1}}
                    onChangeText={(text) =>
                      this.setState({robot: {gains: {Kp: text, Kd: this.state.robot.gains.Kd, Ki: this.state.robot.gains.Ki}}})}
                    clearButtonMode='always'
                   ></TextInput>
                 <Button mode='outlined' onPress={this.submitKp}>Submit Kp</Button>
                </View>
              </View>

              <View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.getStartedText}>Kd = {this.state.robot.gains.Kd}</Text>
                  <TextInput
                    style={{height:40, width:100, paddingHorizontal:20, marginVertical:10, marginHorizontal:15, borderColor: 'brown', borderWidth: 1}}
                    onChangeText={(text) =>
                      this.setState({robot: {gains: {Kp: this.state.robot.gains.Kp, Kd: text, Ki: this.state.robot.gains.Ki}}})}
                    clearButtonMode='always'
                   ></TextInput>
                 <Button mode='outlined' onPress={this.submitKd}>Submit Kd</Button>
                </View>
              </View>
              <View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.getStartedText}>Ki = {this.state.robot.gains.Ki}</Text>
                  <TextInput
                    style={{height:40, width:100, paddingHorizontal:20, marginVertical:10, marginHorizontal:15, borderColor: 'brown', borderWidth: 1}}
                    onChangeText={(text) =>
                      this.setState({robot: {gains: {Kp: this.state.robot.gains.Kp, Kd: this.state.robot.gains.Kd, Ki: text}}})}
                    clearButtonMode='always'
                   ></TextInput>
                 <Button mode='outlined' onPress={this.submitKi}>Submit Ki</Button>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.getStartedText}>{this.state.appText}</Text>
                <ChangeText writeText={this.writeText}></ChangeText>
              </View>
            </View>



          </ScrollView>

          <View style={styles.tabBarInfoContainer}>
            <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

            <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
              <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
            </View>
          </View>
        </View>
      </PaperProvider>

    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
