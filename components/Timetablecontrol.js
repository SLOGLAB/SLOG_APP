import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "./NavBlackIcon"

const Container = styled.TouchableOpacity`
  padding-right: 0px;
`

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("TimetableNavi")}>
    <NavBlackIcon
      name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
    />
  </Container>
))
