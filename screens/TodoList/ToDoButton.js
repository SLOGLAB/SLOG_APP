import React from "react"
import { Platform, Image } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "../../components/NavBlackIcon"

const Container = styled.TouchableOpacity`
  padding-right: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`
const ButtonText = styled.Text`
  font-size: 15;
  margin-left: 5;
  margin-bottom: 3;
  font-family: "GmarketMedium";
`

export default withNavigation(({ navigation }) => (
  <Container
    onPress={() => {
      navigation.navigate("TodoListSwiper")
    }}
  >
    <Image source={require("../../assets/todo1.png")} style={{ height: 12, width: 75 }} />

    {/* <NavBlackIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={30} />
    <ButtonText>To do</ButtonText> */}
  </Container>
))
