import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "@apollo/react-hooks"
import { REQUEST_LOGIN } from "./AuthQueries"
import { useLogIn } from "../../AuthContext"
import { ME } from "../../screens/Tabs/MainController"
import constants from "../../constants"

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  /* background-color: ${(props) => props.theme.classicBlue}; */
`

const Touchable = styled.TouchableOpacity``

const LoginLink = styled.View``
const MarginR = styled.View``

const LoginLinkText = styled.Text`
  color: ${(props) => props.theme.darkGreyColor};
  margin-top: 20px;
  font-family: "GmarketBold";
`

export default ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const emailInput = useInput("")
  const confirmInput = useInput("")

  const [requestLoginMutation] = useMutation(REQUEST_LOGIN, {
    variables: { email: emailInput.value, password: confirmInput.value },
    // refetchQueries: () => [{ query: ME }],
  })

  // const logIn = useLogIn()

  const logIn = useLogIn()
  const handleLogin = async () => {
    const { value } = emailInput
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (value === "") {
      return Alert.alert("Email을 입력하세요.")
    } else if (!emailRegex.test(value)) {
      return Alert.alert("Email 형식을 다시 확인하세요.")
    }

    try {
      setLoading(true)
      const {
        data: { requestLogin: token },
      } = await requestLoginMutation()
      if (token !== "" || token !== false) {
        logIn(token)
      } else {
        Alert.alert("로그인 시스템에 문제가 있습니다.")
      }
    } catch (e) {
      if (e.message.includes("GraphQL error")) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } else {
        Alert.alert(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (navigation.state.params) {
      if (navigation.state.params.checkBool) {
        navigation.state.params.checkBool = false
        emailInput.setValue(navigation.state.params.userEmail)
        return
      }
    }
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...emailInput}
          placeholder="Email (예: DeepTime@google.com)"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
          secureTextEntry={false}
        />
        <MarginR style={{ height: constants.height / 90 }} />

        <AuthInput
          {...confirmInput}
          placeholder="비밀번호 (예: ABCD1234)"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
          secureTextEntry={true}
          marginArray={[0, 0, 20, 0]}
        />
        <AuthButton
          bgColor={"#0f4c82"}
          loading={loading}
          onPress={handleLogin}
          text="로그인"
          color="white"
        />
        <Touchable onPress={() => navigation.navigate("FindEmail")}>
          <LoginLink>
            <LoginLinkText>Email 찾기</LoginLinkText>
          </LoginLink>
        </Touchable>
        <Touchable onPress={() => navigation.navigate("FindPassword")}>
          <LoginLink>
            <LoginLinkText>비밀번호 찾기</LoginLinkText>
          </LoginLink>
        </Touchable>
      </View>
    </TouchableWithoutFeedback>
  )
}
