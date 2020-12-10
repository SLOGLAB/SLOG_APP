import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "./NavBlackIcon"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("MenuNavigation")}>
    <NavBlackIcon name={Platform.OS === "ios" ? "ios-menu" : "md-menu"} />
  </Container>
))
