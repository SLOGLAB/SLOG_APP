import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Text,
  Linking,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import constants from "../../constants"
import { Alert } from "react-native"
import { useMutation } from "@apollo/react-hooks"
import * as Facebook from "expo-facebook"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"
import {
  LOG_IN,
  CREATE_ACCOUNT,
  S_EMAIL_VERIFICATION,
  C_EMAIL_VERIFICATION,
  S_PHONE_VERIFICATION,
  C_PHONE_VERIFICATION,
} from "./AuthQueries"
import { Google } from "expo"
import Modal from "react-native-modal"
import NumberOnChange from "../../components/NumberOnChange"
import RNPickerSelect from "react-native-picker-select"
import {
  studyOption_group,
  studyOption_group2,
  studyOption_group3,
  address1,
  address2_total,
} from "../../components/LongArray"
import useSelect from "../../hooks/useSelect"
import useSelect_dynamic from "../../hooks/useSelect_dynamic"
import useSelect_dynamic2 from "../../hooks/useSelect_dynamic2"
import { CheckBox } from "native-base"
import LastWidth from "../../components/LastWidth"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`

const View2 = styled.View`
  justify-content: flex-start;
  align-items: center;
  flex: 1;
`

const ErrorView = styled.View`
  margin-bottom: 10px;
`

const RowView = styled.View`
  flex-direction: row;
`

const CheckWrap = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
`

const MarginR = styled.View``

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 모달창 크기 조절 */
  flex: 0.35;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`

const TitleText = styled.Text`
  flex: 0.5;
  font-size: 25;
  font-family: "GmarketBold";
`
const Title = styled.Text`
  font-size: 18;
  font-family: "GmarketBold";

  margin-bottom: 15;
`
const Sub1 = styled.Text`
  font-size: 13;
  font-family: "GmarketMedium";
`
const Sub = styled.Text`
  font-size: 13;
  margin-bottom: 25;
  font-family: "GmarketMedium";
`
const SelectView = styled.View``

const FBContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-color: ${(props) => props.theme.lightGreyColor};
  border-style: solid;
`

const GoogleContainer = styled.View`
  margin-top: 20px;
`

export default ({ navigation }) => {
  const minLen_6 = (value) => value.length < 6 && value.length > 0
  const maxLen_11 = (value) => value.length < 12

  const fNameInput = useInput("")
  const lNameInput = useInput("")
  const emailInput = useInput(navigation.getParam("email", ""))
  const usernameInput = useInput("")
  const phoneNumberInput = useInput("")
  const emailKey = useInput("")
  const phoneKey = useInput("")
  const password = useInput("", "", minLen_6)
  const passChk = (value) => value !== password.value
  const password2 = useInput("", "", passChk)

  const [loading, setLoading] = useState(false)
  const [acLoading, setAcLoading] = useState(false)
  const [vLoading, setVLoading] = useState(false)
  const [isEmailVisible, setEmailVisible] = useState(false)
  const [isPhoneVisible, setPhoneVisible] = useState(false)
  const [isCheckVisible, setCheckVisible] = useState(false)
  const [tos, setTos] = useState(false)
  const [top, setTop] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [isQVisible, setisQVisible] = useState(false)

  // const studyGroup = useSelect(studyOption_group)
  // const studyGroup2 = useSelect_dynamic(studyOption_group2, studyGroup.optionIndex)
  // const studyGroup3 = useSelect_dynamic2(
  //   studyOption_group3,
  //   studyGroup.optionIndex,
  //   studyGroup2.optionIndex
  // )

  const studyPurpose = useSelect([
    { label: "학습", value: "학습" },
    { label: "업무", value: "업무" },
  ])
  const studyGroup = useSelect(studyOption_group)

  const studyGroup2 = useSelect_dynamic(
    studyOption_group2,
    // studyOption_group2,
    studyGroup.optionList.indexOf(studyGroup.value)
  )

  const studyGroup3 = useSelect_dynamic2(
    studyOption_group3,
    studyGroup.optionList.indexOf(studyGroup.value),
    // studyGroup2.optionIndex,
    studyGroup2.optionList.indexOf(studyGroup2.value)
  )
  const myAddress1 = useSelect(address1)
  const myAddress2 = useSelect_dynamic(address2_total, myAddress1.optionIndex)

  const [sEmailVerificationMutation] = useMutation(S_EMAIL_VERIFICATION, {
    variables: {
      emailAdress: emailInput.value,
    },
  })
  const [cEmailVerificationMutation] = useMutation(C_EMAIL_VERIFICATION, {
    variables: {
      emailAdress: emailInput.value,
      key: emailKey.value,
    },
  })
  const [sPhoneVerificationMutation] = useMutation(S_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: "82" + phoneNumberInput.value,
    },
  })
  const [cPhoneVerificationMutation] = useMutation(C_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: "82" + phoneNumberInput.value,
      key: phoneKey.value,
    },
  })
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: usernameInput.value,
      email: emailInput.value,
      phoneNumber: "82" + phoneNumberInput.value,
      firstName: fNameInput.value,
      lastName: lNameInput.value,
      password: password.value,
      address1: myAddress1.value,
      address2: myAddress2.value,
      termsOfMarketing: marketing,
      studyPurpose: studyPurpose.value,
      studyGroup: studyPurpose.value === "학습" ? studyGroup.value : "해당 없음",
      studyGroup2: studyPurpose.value === "학습" ? studyGroup2.value : "해당 없음",
      studyGroup3: studyPurpose.value === "학습" ? studyGroup3.value : "해당 없음",
    },
  })

  const onChangeAllTerm = () => {
    if (tos && top && marketing) {
      setTos(false)
      setTop(false)
      setMarketing(false)
    } else {
      setTos(true)
      setTop(true)
      setMarketing(true)
    }
  }

  const onChangeTos = (e) => {
    setTos(e)
  }

  const onChangeTop = (e) => {
    setTop(e)
  }

  const onChangeMarketing = (e) => {
    setMarketing(e)
  }

  const createAccountOnClick = async () => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(emailInput.value)) {
      return Alert.alert("이메일이 유효하지 않습니다.")
    } else if (fNameInput.value === "") {
      return Alert.alert("이름을 입력하세요.")
    } else if (lNameInput.value === "") {
      return Alert.alert("성을 입력하세요.")
    } else if (usernameInput.value === "") {
      return Alert.alert("닉네임을 입력하세요.")
    } else if (phoneNumberInput.value === "") {
      return Alert.alert("휴대폰 번호를 입력하세요.")
    }

    if (tos === true && top === true) {
      if (password.errorChk === false && password2.errorChk === false) {
        try {
          setAcLoading(true)
          const {
            data: { createAccount },
          } = await createAccountMutation()
          if (!createAccount) {
            Alert.alert("계정을 만들 수 없습니다.")
          } else {
            Alert.alert("계정이 만들어졌습니다.\n로그인을 시도하세요.")
            navigation.navigate("Login", {
              userEmail: emailInput.value,
              checkBool: true,
            })
          }
        } catch (e) {
          const realText = e.message.split("GraphQL error: ")
          Alert.alert(realText[1])
        } finally {
          setAcLoading(false)
        }
      } else {
        Alert.alert("비밀번호를 다시 확인하세요.")
      }
    } else {
      Alert.alert("필수 약관에 동의하세요.")
    }
  }

  const sEmailOnClick = async () => {
    try {
      setVLoading(true)
      const {
        data: { startEmailVerification },
      } = await sEmailVerificationMutation()
      if (!startEmailVerification) {
        Alert.alert("인증번호를 요청할 수 없습니다.")
      } else {
        Alert.alert("해당 Email로 인증번호를 발송했습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setVLoading(false)
    }
  }

  const cEmailOnClick = async () => {
    try {
      setLoading(true)
      await cEmailVerificationMutation()
      emailKey.setValue("")
      setEmailVisible(false)
      Alert.alert("Email 인증이 완료됐습니다.")
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setLoading(false)
    }
  }

  const sPhoneOnClick = async () => {
    try {
      setVLoading(true)
      const {
        data: { startPhoneVerification },
      } = await sPhoneVerificationMutation()
      if (!startPhoneVerification) {
        Alert.alert("인증번호를 요청할 수 없습니다.")
      } else {
        Alert.alert("해당 번호로 인증번호를 발송했습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setVLoading(false)
    }
  }
  const cPhoneOnClick = async () => {
    try {
      setLoading(true)
      await cPhoneVerificationMutation()
      phoneKey.setValue("")
      setPhoneVisible(false)
      Alert.alert("휴대폰 인증이 완료됐습니다.")
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setLoading(false)
    }
  }
  const style_tmp = {
    ...pickerSelectStyles,
    iconContainer: {
      top: 20,
      right: 10,
    },
    placeholder: {
      color: "black",
      fontSize: 14,
      fontWeight: "bold",
    },
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <CheckWrap>
          <Title>회원가입</Title>
        </CheckWrap>
        <RowView>
          <AuthInput
            paddingArray={[5, 5, 5, 5]}
            {...lNameInput}
            placeholder="성 (예: 홍)"
            autoCapitalize="words"
            widthRatio={4.5}
          />
          <MarginR style={{ width: constants.width / 40 }} />
          <AuthInput
            paddingArray={[5, 5, 5, 5]}
            {...fNameInput}
            placeholder="이름 (예: 길동)"
            autoCapitalize="words"
            widthRatio={LastWidth(1.7, 4.5, 40)}
          />
        </RowView>
        <MarginR style={{ height: constants.height / 90 }} />

        <AuthInput
          paddingArray={[5, 5, 5, 5]}
          {...usernameInput}
          placeholder="닉네임 (10글자 이내)"
          returnKeyType="send"
          autoCorrect={false}
        />
        <MarginR style={{ height: constants.height / 90 }} />

        <RowView>
          <AuthInput
            paddingArray={[5, 5, 5, 5]}
            value={emailInput.value}
            onChange={() => {}}
            placeholder="email 인증 버튼 =>"
            keyboardType="email-address"
            returnKeyType="send"
            autoCorrect={false}
            widthRatio={2.5}
          />
          <MarginR style={{ width: constants.width / 40 }} />
          <AuthButton
            color="white"
            onPress={() => setEmailVisible(true)}
            text="인증"
            paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
            widthRatio={LastWidth(1.7, 2.5, 40)}
          />
        </RowView>
        <MarginR style={{ height: constants.height / 90 }} />

        <Modal
          isVisible={isEmailVisible}
          onBackdropPress={() => setEmailVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
          <StyledModalContainer style={{ width: constants.width / 1.5 }}>
            <TitleText>Email 인증</TitleText>
            <RowView>
              <AuthInput
                {...emailInput}
                placeholder="(예: DeepTime@google.com)"
                keyboardType="email-address"
                returnKeyType="send"
                autoCorrect={false}
                widthRatio={2.5}
                marginArray={[10, 0, 10, 0]}
              />
              <MarginR style={{ width: constants.width / 40 }} />
              <AuthButton
                color="white"
                loading={vLoading}
                onPress={sEmailOnClick}
                text="인증"
                marginArray={[10, 0, 10, 0]}
                paddingArray={Platform.OS === "ios" ? [12, 10, 12, 10] : [15, 10, 15, 10]}
                widthRatio={LastWidth(1.7, 2.5, 40)}
              />
            </RowView>
            <AuthInput
              {...emailKey}
              placeholder="인증번호 입력"
              returnKeyType="send"
              autoCorrect={false}
              marginArray={[0, 0, 20, 0]}
            />
            <AuthButton
              color="white"
              bgColor={"#0f4c82"}
              loading={loading}
              onPress={cEmailOnClick}
              text="인증 완료"
            />
          </StyledModalContainer>
        </Modal>
        <RowView>
          <AuthInput
            paddingArray={[5, 5, 5, 5]}
            marginArray={[0, 0, 0, 0]}
            value={phoneNumberInput.value}
            onChange={() => {}}
            placeholder="휴대폰 인증 버튼=>"
            returnKeyType="send"
            autoCorrect={false}
            widthRatio={2.5}
          />
          <MarginR style={{ width: constants.width / 40 }} />
          <AuthButton
            color="white"
            onPress={() => {
              setPhoneVisible(true)
            }}
            text="인증"
            paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
            widthRatio={LastWidth(1.7, 2.5, 40)}
          />
        </RowView>
        <Modal
          isVisible={isPhoneVisible}
          onBackdropPress={() => setPhoneVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
          <StyledModalContainer style={{ width: constants.width / 1.5 }}>
            <TitleText>휴대폰 인증</TitleText>
            <RowView>
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
                widthRatio={2.5}
                marginArray={[10, 0, 10, 0]}
              />
              <MarginR style={{ width: constants.width / 40 }} />
              <AuthButton
                color="white"
                loading={vLoading}
                onPress={sPhoneOnClick}
                text="인증"
                marginArray={[10, 0, 10, 0]}
                paddingArray={Platform.OS === "ios" ? [12, 10, 12, 10] : [15, 10, 15, 10]}
                widthRatio={LastWidth(1.7, 2.5, 40)}
              />
            </RowView>
            <AuthInput
              {...phoneKey}
              placeholder="인증번호 입력"
              returnKeyType="send"
              autoCorrect={false}
              marginArray={[0, 0, 20, 0]}
            />
            <AuthButton
              color="white"
              bgColor={"#0f4c82"}
              loading={loading}
              onPress={cPhoneOnClick}
              text="인증 완료"
            />
          </StyledModalContainer>
        </Modal>
        <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />
        {/* <SelectView style={{ width: constants.width / 1.7 }}>
           <RNPickerSelect
            {...studyPurpose}
            style={style_tmp}
            placeholder={{
              label: "사용목적...",
              value: null,
              color: "red",
            }}
          /> 
          <RowView>
            <SelectView style={{ width: constants.width / 2.5, marginRight: 10 }}>
              <RNPickerSelect
                {...studyPurpose}
                style={style_tmp}
                placeholder={{
                  label: "사용목적...",
                  value: null,
                  color: "red",
                }}
              />
            </SelectView>
            <AuthButton
              color="white"
              onPress={() => {
                setisQVisible(true)
              }}
              text="?"
              paddingArray={Platform.OS === "ios" ? [5, 5, 5, 5] : [10, 10, 10, 10]}
              widthRatio={LastWidth(1.7, 2.5, 40)}
              bgColor={"#0f4c82"}
            />
          </RowView>
        </SelectView> */}
        <Modal
          isVisible={isQVisible}
          onBackdropPress={() => setisQVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
          <StyledModalContainer style={{ width: constants.width / 1.2 }}>
            <View>
              <Title>학습</Title>
              <Sub1>스케줄을 크게 '자습','강의' 2가지로 구분 가능</Sub1>
              <Sub>(자습과 인강 수강 위주의 생활패턴 사용자에게 적합)</Sub>

              <Title>업무</Title>
              <Sub1>스케줄을 크게 '업무','개인' 2가지로 구분 가능</Sub1>
              <Sub>(직장 업무 및 자기 개발 위주의 생활패턴 사용자에게 적합)</Sub>
              <AuthButton
                color="white"
                bgColor={"#0f4c82"}
                loading={loading}
                onPress={() => {
                  setisQVisible(false)
                }}
                text="닫기"
              />
            </View>
          </StyledModalContainer>
        </Modal>
        {studyPurpose.value === "학습" && (
          <>
            <SelectView style={{ width: constants.width / 1.7 }}>
              <RNPickerSelect
                {...studyGroup}
                style={style_tmp}
                placeholder={{
                  label: "학습 그룹 1...",
                  value: null,
                  color: "red",
                }}
              />
            </SelectView>
            <SelectView style={{ width: constants.width / 1.7 }}>
              <RNPickerSelect
                {...studyGroup2}
                style={style_tmp}
                placeholder={{
                  label: "학습 그룹 2...",
                  value: null,
                  color: "red",
                }}
              />
            </SelectView>
            <SelectView style={{ width: constants.width / 1.7 }}>
              <RNPickerSelect
                {...studyGroup3}
                style={style_tmp}
                placeholder={{
                  label: "학습 그룹 3...",
                  value: null,
                  color: "red",
                }}
              />
            </SelectView>
          </>
        )}
        <SelectView style={{ width: constants.width / 1.7 }}>
          <RNPickerSelect
            {...myAddress1}
            style={style_tmp}
            placeholder={{
              label: "주소 구분 1...",
              value: null,
              color: "red",
            }}
          />
        </SelectView>
        <SelectView style={{ width: constants.width / 1.7 }}>
          <RNPickerSelect
            {...myAddress2}
            style={style_tmp}
            placeholder={{
              label: "주소 구분 2...",
              value: null,
              color: "red",
            }}
          />
        </SelectView>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 0, paddingLeft: 10 }}
        >
          {password.errorChk && (
            <ErrorView>
              <Text style={{ color: "red" }}>비밀번호는 6글자 이상이어야 합니다</Text>
            </ErrorView>
          )}
          <AuthInput
            paddingArray={[5, 5, 5, 5]}
            {...password}
            placeholder="비밀번호 (예: ABCD1234)"
            returnKeyType="send"
            autoCorrect={false}
            secureTextEntry={true}
          />
          <MarginR style={{ height: constants.height / 90 }} />

          {password2.errorChk && (
            <ErrorView>
              <Text style={{ color: "red" }}>비밀번호가 일치하지 않습니다</Text>
            </ErrorView>
          )}
          <AuthInput
            paddingArray={[5, 5, 5, 5]}
            {...password2}
            placeholder="비밀번호 확인 (예: ABCD1234)"
            returnKeyType="send"
            autoCorrect={false}
            secureTextEntry={true}
          />
          <MarginR style={{ height: constants.height / 90 }} />

          <CheckWrap style={{ width: constants.width / 1.6 }}>
            <CheckBox checked={tos && top && marketing} onPress={() => onChangeAllTerm()} />
            <View style={{ marginLeft: 15 }}>
              <Text>만 14세 이상이며, 약관에 모두 동의 </Text>
              <Text style={{ color: "#0f4c82" }} onPress={() => setCheckVisible(true)}>
                (약관 및 세부사항 선택)
              </Text>
            </View>
          </CheckWrap>
          <Modal
            isVisible={isCheckVisible}
            onBackdropPress={() => setCheckVisible(false)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: Math.round(Dimensions.get("window").height),
            }}
          >
            <StyledModalContainer style={{ width: constants.width / 1.5 }}>
              <TitleText>약관 및 세부사항 선택</TitleText>
              <CheckWrap style={{ width: constants.width / 1.8 }}>
                <CheckBox checked={tos} onPress={() => onChangeTos(!tos)} />
                <View2 style={{ marginLeft: 25, flexDirection: "row" }}>
                  <Text
                    style={{ color: "#3897f0" }}
                    onPress={() => {
                      Linking.openURL("https://www.slog-iam.com/#/tos")
                    }}
                  >
                    서비스 이용약관
                  </Text>
                  <Text>동의 </Text>
                  <Text style={{ color: "#ED4956" }}>(필수)</Text>
                </View2>
              </CheckWrap>
              <CheckWrap style={{ width: constants.width / 1.8 }}>
                <CheckBox checked={top} onPress={() => onChangeTop(!top)} />
                <View2 style={{ marginLeft: 25, flexDirection: "row" }}>
                  <Text
                    style={{ color: "#3897f0" }}
                    onPress={() => {
                      Linking.openURL("https://www.slog-iam.com/#/top")
                    }}
                  >
                    개인정보 취급방침
                  </Text>
                  <Text>동의 </Text>
                  <Text style={{ color: "#ED4956" }}>(필수)</Text>
                </View2>
              </CheckWrap>
              <CheckWrap style={{ width: constants.width / 1.8 }}>
                <CheckBox checked={marketing} onPress={() => onChangeMarketing(!marketing)} />
                <View2 style={{ marginLeft: 25, flexDirection: "row" }}>
                  <Text
                    style={{ color: "#3897f0" }}
                    onPress={() => {
                      Linking.openURL("https://www.slog-iam.com/#/tom")
                    }}
                  >
                    마케팅 정보 수신 동의
                  </Text>
                  <Text style={{ color: "#7E7F7D" }}>(선택)</Text>
                </View2>
              </CheckWrap>
            </StyledModalContainer>
          </Modal>
          <AuthButton
            color="white"
            bgColor={"#0f4c82"}
            loading={acLoading}
            onPress={createAccountOnClick}
            text="회원가입"
            marginArray={[0, 0, 0, 0]}
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    marginBottom: 10,
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",

    // paddingRight: 30, // to ensure the text is never behind the icon
  },
})
// const handleSingup = async () => {
//   const { value: email } = emailInput
//   const { value: fName } = fNameInput
//   const { value: lName } = lNameInput
//   const { value: username } = usernameInput
//   const { value: phoneNumber } = phoneNumberInput

//   const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   if (!emailRegex.test(email)) {
//     return Alert.alert("이메일이 유효하지 않습니다.")
//   }
//   if (fName === "") {
//     return Alert.alert("이름을 입력하세요.")
//   }
//   if (lName === "") {
//     return Alert.alert("성을 입력하세요.")
//   }
//   if (username === "") {
//     return Alert.alert("닉네임을 입력하세요.")
//   }
//   if (phoneNumber === "") {
//     return Alert.alert("휴대폰 번호를 입력하세요.")
//   }

//   try {
//     setLoading(true)
//     const {
//       data: { createAccount },
//     } = await createAccountMutation()
//     if (createAccount) {
//       Alert.alert("Account created", "Log in now!")
//       navigation.navigate("Login", { email })
//     }
//   } catch (e) {
//     Alert.alert("Username taken.", "Log in instead")
//     navigation.navigate("Login", { email })
//   } finally {
//     setLoading(false)
//   }
// }

// useEffect(() => {
//   console.log(phoneNumberInput.value), [];
// });

// const fbLogin = async () => {
//   try {
//     setLoading(true)
//     const { type, token } = await Facebook.logInWithReadPermissionsAsync("225109715315781", {
//       permissions: ["public_profile", "email"]
//     })
//     if (type === "success") {
//       const response = await fetch(
//         `https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`
//       )
//       const { email, first_name, last_name } = await response.json()
//       updateFormData(email, first_name, last_name)
//       setLoading(false)
//     } else {
//       // type === 'cancel'
//     }
//   } catch ({ message }) {
//     alert(`Facebook Login Error: ${message}`)
//   }
// }
// const googleLogin = async () => {
//   const GOOGLE_ID = "535073727575-47fmk0phileahhq38ekv2s3daf76vttu.apps.googleusercontent.com"
//   try {
//     setLoading(true)
//     const result = await Google.logInAsync({
//       iosClientId: GOOGLE_ID,
//       scopes: ["profile", "email"]
//     })
//     if (result.type === "success") {
//       const user = await fetch("https://www.googleapis.com/userinfo/v2/me", {
//         headers: { Authorization: `Bearer ${result.accessToken}` }
//       })
//       const { email, family_name, given_name } = await user.json()
//       updateFormData(email, given_name, family_name)
//     } else {
//       return { cancelled: true }
//     }
//   } catch (e) {
//     console.log(e)
//   } finally {
//     setLoading(false)
//   }
// }
// const updateFormData = (email, firstName, lastName) => {
//   emailInput.setValue(email)
//   fNameInput.setValue(firstName)
//   lNameInput.setValue(lastName)
//   const [username] = email.split("@")
//   usernameInput.setValue(username)
// }

{
  /* <FBContainer>
          <AuthButton
                        color="white"

            bgColor={"#2D4DA7"}
            loading={false}
            onPress={fbLogin}
            text="Connect Facebook"
          />
        </FBContainer>
        <GoogleContainer>
          <AuthButton
            bgColor={"#EE1922"}
            loading={false}
            onPress={googleLogin}
            text="Connect Google"
          />
        </GoogleContainer> */
}
