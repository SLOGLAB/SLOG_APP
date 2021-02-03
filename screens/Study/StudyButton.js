import React from "react"
import { Platform, Image } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import Icon from "../../components/Icon"
import * as ScreenOrientation from "expo-screen-orientation"
// import Group79 from "../../assets/Group79"
const Container = styled.TouchableOpacity`
  padding-right: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ButtonText = styled.Text`
  font-size: 30;
  margin-left: 5;
  margin-bottom: 3;
  color: rgba(15, 76, 130, 1);
  font-family: "GmarketMedium";
`

export default withNavigation(({ navigation }) => (
  <Container
    onPress={() => {
      navigation.navigate("StudyContainer")
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }}
  >
    {/* <Icon
      name={Platform.OS === "ios" ? "ios-play-circle" : "md-play-circle"}
      size={30}
      color={"#0F4C82"}
    /> */}
    <Image source={require("../../assets/Group1.png")} style={{ height: 25, width: 25 }} />
    <ButtonText>Play</ButtonText>
  </Container>
))
