import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "./NavBlackIcon"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
  margin-left: 20;
`

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("Timecontrol")}>
    <NavBlackIcon name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"} />
  </Container>
))
