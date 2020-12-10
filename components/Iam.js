// import React from "react"
// import styled from "styled-components"
// import { withNavigation } from "react-navigation"
// import constants from "../constants"

// const Image = styled.Image`
//   width: ${constants.width / 3};
// `
// const Container = styled.TouchableOpacity`
//   padding-right: 20px;
//   margin-left: 20;
// `

// export default withNavigation(({ navigation }) => (
//   <Container onPress={() => navigation.navigate("MenuNavigation")}>
//     <NavIcon name={Platform.OS === "ios" ? "ios-menu" : "md-menu"} />
//   </Container>
// ))

import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import constants from "../constants"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`
const Text = styled.Text``
const Image = styled.Image`
  width: ${constants.width / 3};
`
export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("MenuNavigation")}>
    <Image
      style={{ height: 40, width: 40, marginLeft: 190 }}
      source={require("../assets/IAM_logo.jpg")}
    />
  </Container>
))
