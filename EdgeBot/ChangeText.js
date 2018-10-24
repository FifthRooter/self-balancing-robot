import React, { Component } from 'react';
import { AppRegistry, TextInput, View, Button } from 'react-native';

export default class ChangeText extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }


  submitAndClear = () => {
    this.props.writeText(this.state.text)
    this.setState({
      text: ''
    })
  }

  render() {
    return (
      <View>
        <TextInput
          style={{height: 40, width:220, marginTop:14,marginBottom:5, paddingHorizontal: 30, borderColor: 'yellow', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          clearButtonMode='always'
        />
        <Button
          onPress={this.submitAndClear}
          title='Submit'
          color='#0D98BA'
          placeholder='Enter text...'></Button>
      </View>

    );
  }
}

AppRegistry.registerComponent('clear-text', () => HomeScreen)
