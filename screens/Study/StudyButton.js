import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "../../components/NavBlackIcon"
import * as ScreenOrientation from "expo-screen-orientation"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ButtonText = styled.Text`
  font-size: 15;
  margin-left: 5;
  margin-bottom: 3;
`

export default withNavigation(({ navigation }) => (
  <Container
    onPress={() => {
      navigation.navigate("StudyContainer")
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    }}
  >
    <NavBlackIcon name={Platform.OS === "ios" ? "ios-play-circle" : "md-play-circle"} size={30} />
    <ButtonText>Start</ButtonText>
  </Container>
))
