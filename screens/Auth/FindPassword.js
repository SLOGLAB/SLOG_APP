import React, { useState } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "@apollo/react-hooks"
import { S_EMAIL_FINDPASSWORD, C_EMAIL_FINDPASSWORD } from "./AuthQueries"

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`

const Touchable = styled.TouchableOpacity``

const LoginLink = styled.View``

const LoginLinkText = styled.Text`
  color: ${(props) => props.theme.darkGreyColor};
  margin-top: 20px;
  font-weight: 600;
`

export default ({ navigation }) => {
  const emailInput = useInput("")
  const emailKey = useInput("")

  const [sLoading, setSLoading] = useState(false)
  const [cLoading, setCLoading] = useState(false)

  const [sEmailFindPasswordMutation] = useMutation(S_EMAIL_FINDPASSWORD, {
    variables: {
      emailAdress: emailInput.value,
    },
  })
  const [cEmailFindPasswordMutation] = useMutation(C_EMAIL_FINDPASSWORD, {
    variables: {
      emailAdress: emailInput.value,
      key: emailKey.value,
    },
  })

  const sfindOnClick = async () => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailInput.value === "") {
      return Alert.alert("Email을 입력하세요.")
    } else if (!emailRegex.test(emailInput.value)) {
      return Alert.alert("Email 형식을 다시 확인하세요.")
    }

    try {
      setSLoading(true)
      const {
        data: { startEmailFindPassword },
      } = await sEmailFindPasswordMutation()
      if (!startEmailFindPassword) {
        Alert.alert("인증번호를 요청할 수 없습니다.")
      } else {
        Alert.alert("해당 Email로 인증번호를 발송했습니다.\n메일이 없으면 스팸메일함을 확인하세요.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setSLoading(false)
    }
  }

  const cfindOnClick = async () => {
    try {
      setCLoading(true)
      await cEmailFindPasswordMutation()
      Alert.alert("Email로 임시 비밀번호가 발급됐습니다.\n비밀번호 확인 후 로그인을 시도하세요.")
      navigation.navigate("Login", {
        userEmail: emailInput.value,
        checkBool: true,
      })
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setCLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...emailInput}
          placeholder="Email (예: iam@google.com)"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthButton
          loading={sLoading}
          onPress={sfindOnClick}
          text="Eamil로 인증번호 (재)발송"
          marginArray={[0, 0, 10, 0]}
          color="white"
        />
        <AuthInput
          {...emailKey}
          placeholder="인증번호 입력"
          returnKeyType="send"
          autoCorrect={false}
          secureTextEntry={true}
          marginArray={[0, 0, 20, 0]}
        />
        <AuthButton
          bgColor={"#0f4c82"}
          loading={cLoading}
          onPress={cfindOnClick}
          color="white"
          text="인증 (비밀번호 찾기)"
        />
        <Touchable onPress={() => navigation.navigate("Login")}>
          <LoginLink>
            <LoginLinkText>로그인</LoginLinkText>
          </LoginLink>
        </Touchable>
      </View>
    </TouchableWithoutFeedback>
  )
}
