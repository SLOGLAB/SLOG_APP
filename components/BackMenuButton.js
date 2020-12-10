import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavWhiteIcon from "./NavWhiteIcon"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
  margin-left: 20;
`

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("Menu")}>
    <NavWhiteIcon name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"} />
  </Container>
))

// style={{ height: 40, width: 40, marginLeft: 30 }}
