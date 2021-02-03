import React, { useState } from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import { Alert } from "react-native"
import { useMutation } from "@apollo/react-hooks"
import { S_PHONE_FINDEMAIL, C_PHONE_FINDEMAIL } from "./AuthQueries"
import NumberOnChange from "../../components/NumberOnChange"

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
  font-family: "GmarketBold";
`

export default ({ navigation }) => {
  const maxLen_11 = (value) => value.length < 12

  const phoneNumberInput = useInput("")
  const phoneKey = useInput("")

  const [sLoading, setSLoading] = useState(false)
  const [cLoading, setCLoading] = useState(false)

  const [sPhoneFindEmailMutation] = useMutation(S_PHONE_FINDEMAIL, {
    variables: {
      phoneNumber: "82" + phoneNumberInput.value,
    },
  })
  const [cPhoneFindEmailMutation] = useMutation(C_PHONE_FINDEMAIL, {
    variables: {
      phoneNumber: "82" + phoneNumberInput.value,
      key: phoneKey.value,
    },
  })

  const sfindOnClick = async () => {
    try {
      setSLoading(true)
      const {
        data: { startPhoneFindEmail },
      } = await sPhoneFindEmailMutation()
      if (!startPhoneFindEmail) {
        Alert.alert("인증번호를 요청할 수 없습니다.")
      } else {
        Alert.alert("해당 번호로 인증번호를 발송했습니다.")
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
      const {
        data: { completePhoneFindEmail: userEmail },
      } = await cPhoneFindEmailMutation()
      Alert.alert("휴대폰 인증이 완료됐습니다.\n로그인을 시도하세요.")
      navigation.navigate("Login", {
        userEmail,
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
          value={phoneNumberInput.value}
          onChange={(text) => {
            const setState = phoneNumberInput.setValue
            const validator = maxLen_11
            NumberOnChange({ text, setState, validator })
          }}
          placeholder="(예: 01012345678)"
          returnKeyType="send"
          keyboardType={"phone-pad"}
          autoCorrect={false}
        />
        <AuthButton
          loading={sLoading}
          onPress={sfindOnClick}
          text="휴대폰으로 인증번호 (재)발송"
          color="white"
          marginArray={[0, 0, 10, 0]}
        />
        <AuthInput
          {...phoneKey}
          placeholder="인증번호 입력"
          returnKeyType="send"
          autoCorrect={false}
          secureTextEntry={true}
          marginArray={[0, 0, 20, 0]}
        />
        <AuthButton
          bgColor={"#0f4c82"}
          loading={cLoading}
          color="white"
          onPress={cfindOnClick}
          text="인증 (Email 찾기)"
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
