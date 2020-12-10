import React from "react"
import styled from "styled-components"
import constants from "../../constants"
import AuthButton from "../../components/AuthButton"

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.classicBlue};
`

const Image = styled.Image`
  width: ${constants.width / 2.5};
  margin-bottom: 100px;
`

const Touchable = styled.TouchableOpacity``

const LoginLink = styled.View``

const LoginLinkText = styled.Text`
  color: rgba(255, 255, 255, 1);
  margin-top: 20px;
  font-weight: 600;
`

export default ({ navigation }) => {
  return (
    <View>
      <Image resizeMode={"contain"} source={require("../../assets/DeepSmall1.png")} />
      <AuthButton
        bgColor={"#ffffff"}
        text={"로그인"}
        color="black"
        onPress={() => navigation.navigate("Login")}
      />
      <Touchable onPress={() => navigation.navigate("Signup")}>
        <LoginLink>
          <LoginLinkText>회원가입</LoginLinkText>
        </LoginLink>
      </Touchable>
    </View>
  )
}
// © 2020 IAM FROM SLOG
