import React from "react"
import styled from "styled-components"
import constants from "../../constants"
import AuthButton from "../../components/AuthButton"

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
`

const Image = styled.Image`
  width: ${constants.width / 2.5};
  margin-bottom: 100px;
`

const Touchable = styled.TouchableOpacity``

const LoginLink = styled.View``

const LoginLinkText = styled.Text`
  color: rgba(0, 0, 0, 1);
  margin-top: 20px;
  font-weight: 600;
`
const Logo = styled.View`
  width: ${constants.width / 1};
`

export default ({ navigation }) => {
  return (
    <View>
      <Image
        resizeMode={"contain"}
        source={require("../../assets/SplashDeep.png")}
        style={{ height: 100, width: 250 }}
      />
      <AuthButton
        bgColor={"#0F4B82"}
        text={"로그인"}
        color="white"
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
