import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "./NavBlackIcon"
import * as ScreenOrientation from "expo-screen-orientation"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
  margin-left: 10;
`

export default withNavigation(({ navigation }) => (
  <Container
    onPress={() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      navigation.navigate("TabNavigation")
    }}
  >
    <NavBlackIcon name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"} />
  </Container>
))

// style={{ height: 40, width: 40, marginLeft: 30 }}
