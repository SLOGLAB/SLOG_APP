import React, { Component } from "react"
import { Button, Linking, View, StyleSheet } from "react-native"
import { Constants, WebBrowser } from "expo"

export default class Link1 extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Open URL with ReactNative.Linking"
          onPress={this._handleOpenWithLinking}
          style={styles.button}
        />
        <Button
          title="Open URL with Expo.WebBrowser"
          onPress={this._handleOpenWithWebBrowser}
          style={styles.button}
        />
      </View>
    )
  }

  _handleOpenWithLinking = () => {
    Linking.openURL("https://expo.io")
  }

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync("https://expo.io")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  button: {
    marginVertical: 10
  }
})
