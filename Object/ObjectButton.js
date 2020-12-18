import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "../components/NavBlackIcon"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ButtonText = styled.Text`
  font-size: 15;
  margin-bottom: 3;
`

export default withNavigation(({ navigation }) => (
  //Apps ExObject
  <Container onPress={() => navigation.navigate("Apps")}>
    <NavBlackIcon name={Platform.OS === "ios" ? "ios-camera" : "md-camera"} size={20} />
    <ButtonText>Object</ButtonText>
  </Container>
))
