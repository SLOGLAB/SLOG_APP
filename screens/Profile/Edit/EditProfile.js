import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation } from "@apollo/react-hooks"
import useInput from "../../../hooks/useInput"
import {
  EDIT_ACCOUNT,
  EDIT_ACCOUNT_M,
  EDIT_PASSWORD,
  S_PHONE_VERIFICATION,
  S_EMAIL_VERIFICATION,
  C_EMAIL_VERIFICATION,
  C_PHONE_VERIFICATION,
} from "../AccountTabsQueries"
import {
  studyOption_group,
  studyOption_group2,
  studyOption_group3,
  address1,
  address2_total,
} from "../../../components/LongArray"
import useSelect from "../../../hooks/useSelect"
import useSelect_dynamic from "../../../hooks/useSelect_dynamic"
import useSelect_dynamic2 from "../../../hooks/useSelect_dynamic2"
import { ME } from "../UserProfile"
import {
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native"
import constants from "../../../constants"
import AuthButton from "../../../components/AuthButton"
import AuthInput from "../../../components/AuthInput"
import Icon from "../../../components/Icon"
import AuthInputline from "../../../components/AuthInputline"
import RNPickerSelect from "react-native-picker-select"
import { CheckBox, Row } from "native-base"
import LastWidth from "../../../components/LastWidth"
// import Textarea from "../../../components/Textarea"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import BackButton from "../../../components/BackButton"
import Modal from "react-native-modal"

const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  height: ${constants.height / 1};
`
const EmptyView = styled.View`
  flex: 1;
  align-items: center;
`

const View2 = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex: 0.25;
  /* background-color: "rgba(123, 169, 234, 1)"; */
`
const AndroidView2 = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex: 0.2;
  /* background-color: "rgba(123, 169, 234, 1)"; */
`
const View21 = styled.View`
  flex: 1;
`
const View22 = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1;
`
const ErrorView = styled.View`
  margin-bottom: 10px;
`

const RowView = styled.View`
  flex-direction: row;
`

const CheckWrap = styled.View`
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
  height: 5%;
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
const Sub = styled.Text`
  font-size: 13;
  font-family: "GmarketMedium";
`
const Sub1 = styled.Text`
  font-size: 13;
  color: rgba(33, 87, 150, 1);
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

const CheckView = styled.View`
  margin-left: 15px;
`

const TouchBox = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-left: 0;
  height: 40;
  width: 100;
  border-radius: 10;
  background-color: ${(props) => props.Color};
`
const TouchText = styled.Text`
  color: ${(props) => props.Color};
  font-family: "GmarketMedium";
`
// const BioArea = styled(Textarea)`
//   width: 100%;
//   height: 100px;
//   margin-bottom: 10px;
// `
const StyledPlayModalContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.3;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
`
const ModalSubView = styled.View`
  flex: 0.3;
  align-items: center;
  justify-content: center;
`
const ModalSubView2 = styled.View`
  flex: 0.8;
  width: ${WIDTH / 1.15};
`
const Play_Text = styled.Text`
  font-size: 13;
  font-family: "GmarketMedium";
  margin-bottom: 10;
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const ModalPlay = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 0.3;
`
const LineView = styled.View`
  width: ${WIDTH / 1.4};
  height: 2px;
  color: #000;
`
const PlaySetText = styled.Text`
  font-size: 18;
  margin-bottom: 3;
  color: rgba(15, 76, 130, 1);
  /* color: rgba(255, 255, 255, 1); */
  font-family: "GmarketMedium";
`
const PlayBottom = styled.View`
  align-items: center;
  justify-content: center;
  flex: 0.4;
  width: 100%;
`
const Container = styled.View`
  /* padding-right: 20px; */
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 10px;
  width: 40%;
  /* background-color: rgba(33, 87, 150, 1); */
`
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
let pubOfFeedBool
let pubOfStatisticBool
let pubOfScheduleBool
const EditProfile = ({ navigation, data, refetch, onRefresh, loading }) => {
  const maxLen_11 = (value) => value.length <= 12
  const minLen_6 = (value) => value.length < 6 && value.length > 0
  const minLen_150 = (value) => value.length < 151

  const firstName = useInput(data.me.firstName)
  const lastName = useInput(data.me.lastName)
  const username = useInput(data.me.username, maxLen_11)
  const bio = useInput(data.me.bio, minLen_150)
  const email = useInput(data.me.email)
  const emailKey = useInput("")
  var phone = data.me.phoneNumber
  const phoneNumber = useInput(phone.substring(2, 13))
  const phoneKey = useInput("")
  const organizationName = useInput(data.me.organization?.name)
  const detailAddress = useInput(data.me.organization?.detailAddress)
  const [marketing, setMarketing] = useState(data.me.termsOfMarketing)
  const password_pre = useInput("")
  const password = useInput("", "", minLen_6)
  const passChk = (value) => value !== password.value
  const password2 = useInput("", "", passChk)
  const [acLoading, setAcLoading] = useState(false)
  const [vLoading, setVLoading] = useState(false)
  // console.log(data.me.studyPurpose)
  //개인 데이터 공개 범위 선택
  const [pubOfStatisticBool, setpubOfStatisticBool] = useState(data.me.pubOfStatistic)
  const onChangePubOfStatistic = () => {
    setpubOfStatisticBool(!pubOfStatisticBool)
  }
  const [pubOfScheduleBool, setpubOfScheduleBool] = useState(data.me.pubOfSchedule)
  const onChangePubOfSchedule = () => {
    setpubOfScheduleBool(!pubOfScheduleBool)
  }
  pubOfFeedBool = data.me.pubOfFeed

  const studyPurpose = useSelect(
    [
      { label: "학습", value: "학습" },
      { label: "업무", value: "업무" },
    ],
    data.me.studyPurpose
  )
  const studyGroup = useSelect(
    studyOption_group,
    data.me.studyPurpose === "학습" ? data.me.studyGroup : "중학생"
  )

  const studyGroup2 = useSelect_dynamic(
    studyOption_group2,
    // studyOption_group2,
    studyGroup.optionList.indexOf(studyGroup.value),
    data.me.studyPurpose === "학습" ? data.me.studyGroup2 : "1학년"
  )

  const studyGroup3 = useSelect_dynamic2(
    studyOption_group3,
    studyGroup.optionList.indexOf(studyGroup.value),
    // studyGroup2.optionIndex,
    studyGroup2.optionList.indexOf(studyGroup2.value),
    data.me.studyGroup3
  )

  const myAddress1 = useSelect(address1, data.me.address1)
  const myAddress2 = useSelect_dynamic(
    address2_total,
    // myAddress1.optionIndex,
    myAddress1.optionList.indexOf(myAddress1.value),
    data.me.address2
  )

  const onChangeMarketing = () => {
    setMarketing(!marketing)
  }
  const [editAccountMutation] = useMutation(EDIT_ACCOUNT)
  const [editAccountMMutation] = useMutation(EDIT_ACCOUNT_M)
  const [editPasswordMutation] = useMutation(EDIT_PASSWORD)
  const [sPhoneVerificationMutation] = useMutation(S_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: "82" + phoneNumber.value,
    },
  })
  const [cPhoneVerificationMutation] = useMutation(C_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: "82" + phoneNumber.value,
      key: phoneKey.value,
    },
  })
  const [sEmailVerificationMutation] = useMutation(S_EMAIL_VERIFICATION, {
    variables: {
      emailAdress: email.value,
    },
  })
  const [cEmailVerificationMutation] = useMutation(C_EMAIL_VERIFICATION, {
    variables: {
      emailAdress: email.value,
      key: emailKey.value,
    },
  })

  const onEditAccount = async (e) => {
    e.preventDefault()
    if (data.me.loginPosition === "student") {
      try {
        setAcLoading(true)
        // Alert.alert("프로필 수정 중...")
        const {
          data: { editAccount },
        } = await editAccountMutation({
          variables: {
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            bio: bio.value,
            email: email.value,
            phoneNumber: "82" + phoneNumber.value,
            studyPurpose: studyPurpose.value,
            studyGroup: studyPurpose.value === "학습" ? studyGroup.value : "해당 없음",
            studyGroup2: studyPurpose.value === "학습" ? studyGroup2.value : "해당 없음",
            studyGroup3: studyPurpose.value === "학습" ? studyGroup3.value : "해당 없음",
            address1: myAddress1.value,
            address2: myAddress2.value,
            termsOfMarketing: marketing,
            pubOfFeed: pubOfFeedBool,
            pubOfStatistic: pubOfStatisticBool,
            pubOfSchedule: pubOfScheduleBool,
          },
          refetchQueries: () => [{ query: ME }],
        })

        if (!editAccount) {
          Alert.alert("프로필을 수정할 수 없습니다.")
        } else {
          await refetch()
          Alert.alert("프로필 수정이 완료되었습니다.")
          navigation.navigate("UserProfile")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } finally {
        setAcLoading(false)
      }
    } else {
      try {
        setAcLoading(true)

        // Alert.alert("프로필 수정 중...")
        const {
          data: { editAccount_M },
        } = await editAccountMMutation({
          variables: {
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            email: email.value,
            bio: bio.value,
            phoneNumber: "82" + phoneNumber.value,
            name: organizationName.value,
            address1: myAddress1.value,
            address2: myAddress2.value,
            detailAddress: detailAddress.value,
            termsOfMarketing: marketing,
            pubOfFeed: pubOfFeedBool,
            pubOfStatistic: pubOfStatisticBool,
            pubOfSchedule: pubOfScheduleBool,
          },
          refetchQueries: () => [{ query: ME }],
        })
        if (!editAccount_M) {
          Alert.alert("프로필을 수정할 수 없습니다.")
        } else {
          await refetch()
          Alert.alert("프로필 수정이 완료되었습니다.")
          navigation.navigate("UserProfile")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      } finally {
        setAcLoading(false)
      }
    }
  }

  const onEditPassword = async (e) => {
    e.preventDefault()
    if (password_pre.value === password.value) {
      Alert.alert("이전 비밀번호와 새 비밀번호가 동일합니다.")
    } else if (password.errorChk || password2.errorChk) {
      Alert.alert("새 비밀번호를 다시 확인하세요.")
    } else {
      try {
        setAcLoading(true)
        const {
          data: { editPassword },
        } = await editPasswordMutation({
          variables: {
            password_pre: password_pre.value,
            password: password.value,
          },
        })
        if (!editPassword) {
          Alert.alert("비밀번호를 수정할 수 없습니다.")
          setAcLoading(false)
        } else {
          await refetch()
          password_pre.setValue("")
          password.setValue("")
          password2.setValue("")
          Alert.alert("비밀번호 수정이 완료되었습니다.")
          navigation.navigate("UserProfile")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        // alert(realText[1]);
        Alert.alert(realText[1])
        setAcLoading(false)
      } finally {
        setAcLoading(false)
      }
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

  const cEmailOnClick = async () => {
    try {
      Alert.alert("인증번호 확인 중...")
      await cEmailVerificationMutation()
      emailKey.setValue("")
      Alert.alert("Email 인증이 완료됐습니다.")
      return true
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      return false
    }
  }

  const cPhoneOnClick = async () => {
    try {
      Alert.alert("인증번호 확인 중...")
      await cPhoneVerificationMutation()
      phoneKey.setValue("")
      Alert.alert("휴대폰 인증이 완료됐습니다.")
      return true
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      return false
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
  const [selectPercent, setSelectPercent] = useState(true)
  const [isEmailVisible, setEmailVisible] = useState(false)
  const [isPhoneVisible, setPhoneVisible] = useState(false)
  const [isQVisible, setisQVisible] = useState(false)
  const [modalPlayVisible, setModalPlayVisible] = useState(false)

  return (
    // <SetProfile
    //   data={data}
    //   onRefresh={onRefresh}
    //   navigation={navigation}
    //   loading={loading}
    //   firstName={firstName}
    //   lastName={lastName}
    //   username={username}
    //   bio={bio}
    //   email={email}
    //   emailKey={emailKey}
    //   phoneNumber={phoneNumber}
    //   phoneKey={phoneKey}
    //   studyPurpose={studyPurpose}
    //   studyGroup={studyGroup}
    //   studyGroup2={studyGroup2}
    //   studyGroup3={studyGroup3}
    //   myAddress1={myAddress1}
    //   myAddress2={myAddress2}
    //   organizationName={organizationName}
    //   detailAddress={detailAddress}
    //   marketing={marketing}
    //   onChangeMarketing={onChangeMarketing}
    //   onEditAccount={onEditAccount}
    //   onEditPassword={onEditPassword}
    //   sPhoneOnClick={sPhoneOnClick}
    //   cPhoneOnClick={cPhoneOnClick}
    //   sEmailOnClick={sEmailOnClick}
    //   cEmailOnClick={cEmailOnClick}
    //   password_pre={password_pre}
    //   password={password}
    //   password2={password2}
    //   maxLen_11={maxLen_11}
    //   vLoading={vLoading}
    //   acLoading={acLoading}
    //   pubOfStatisticBool={pubOfStatisticBool}
    //   setpubOfStatisticBool={setpubOfStatisticBool}
    //   onChangePubOfStatistic={onChangePubOfStatistic}
    //   pubOfScheduleBool={pubOfScheduleBool}
    //   setpubOfScheduleBool={setpubOfScheduleBool}
    //   onChangePubOfSchedule={onChangePubOfSchedule}
    // />
    <KeyboardAwareScrollView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      // style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <MainView>
          {Platform.OS === "ios" ? (
            <View2 style={{ width: constants.width / 1.7 }}>
              <View21>
                <TouchBox
                  Color={selectPercent ? "rgba(123, 169, 234, 1)" : "rgba(233, 237, 244, 1)"}
                  onPress={() => {
                    setSelectPercent(true)
                  }}
                >
                  <TouchText Color={selectPercent ? "white" : "grey"}>프로필 편집</TouchText>
                </TouchBox>
              </View21>
              <View22>
                <TouchBox
                  Color={selectPercent ? "rgba(233, 237, 244, 1)" : "rgba(123, 169, 234, 1)"}
                  onPress={() => {
                    setSelectPercent(false)
                  }}
                >
                  <TouchText Color={selectPercent ? "grey" : "white"}>비밀번호 변경</TouchText>
                </TouchBox>
              </View22>
            </View2>
          ) : (
            <AndroidView2 style={{ width: constants.width / 1.7 }}>
              <View21>
                <TouchBox
                  Color={selectPercent ? "rgba(123, 169, 234, 1)" : "rgba(233, 237, 244, 1)"}
                  onPress={() => {
                    setSelectPercent(true)
                  }}
                >
                  <TouchText Color={selectPercent ? "white" : "grey"}>프로필 편집</TouchText>
                </TouchBox>
              </View21>
              <View22>
                <TouchBox
                  Color={selectPercent ? "rgba(233, 237, 244, 1)" : "rgba(123, 169, 234, 1)"}
                  onPress={() => {
                    setSelectPercent(false)
                  }}
                >
                  <TouchText Color={selectPercent ? "grey" : "white"}>비밀번호 변경</TouchText>
                </TouchBox>
              </View22>
            </AndroidView2>
          )}
          {selectPercent ? (
            <EmptyView>
              {/* <ScrollView showsVerticalScrollIndicator={false}> */}
              <RowView>
                <AuthInput
                  paddingArray={[5, 5, 5, 5]}
                  {...lastName}
                  placeholder="성 (예: 홍)"
                  autoCapitalize="words"
                  widthRatio={4.5}
                />
                <MarginR style={{ width: constants.width / 40 }} />
                <AuthInput
                  paddingArray={[5, 5, 5, 5]}
                  {...firstName}
                  placeholder="이름 (예: 길동)"
                  autoCapitalize="words"
                  widthRatio={LastWidth(1.7, 4.5, 40)}
                />
              </RowView>
              <MarginR style={{ height: constants.height / 90 }} />

              <AuthInput
                paddingArray={[5, 5, 5, 5]}
                {...username}
                placeholder="닉네임 (10글자 이내)"
                returnKeyType="send"
                autoCorrect={false}
              />
              <MarginR style={{ height: constants.height / 90 }} />

              <RowView>
                <AuthInput
                  paddingArray={[5, 5, 5, 5]}
                  {...email}
                  onChange={() => {}}
                  placeholder="Email"
                  keyboardType="email-address"
                  returnKeyType="send"
                  autoCorrect={false}
                  widthRatio={2.5}
                />
                <MarginR style={{ width: constants.width / 40 }} />
                <AuthButton
                  color="white"
                  onPress={() => setEmailVisible(true)}
                  text="입력"
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
                      {...email}
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
                      onPress={() => {
                        if (data.email === email.value) {
                          Alert.alert("기존 Email 주소와 동일합니다.")
                        } else {
                          sEmailOnClick()
                        }
                      }}
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
                    onPress={async () => {
                      const fucResult = await cEmailOnClick()
                      if (fucResult) {
                        setEmailVisible(false)
                      }
                    }}
                    text="인증 완료"
                  />
                </StyledModalContainer>
              </Modal>
              <RowView>
                <AuthInput
                  {...phoneNumber}
                  paddingArray={[5, 5, 5, 5]}
                  marginArray={[0, 0, 0, 0]}
                  onChange={() => {}}
                  placeholder="휴대폰 번호"
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
                  text="입력"
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
                      {...phoneNumber}
                      placeholder="(예:01012345678)"
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
              <AuthInputline
                // paddingArray={[0, 0, 90, 5]}
                numberOfLines={3}
                {...bio}
                placeholder="자기소개 (150자 이내)"
                returnKeyType="done"
                autoCorrect={false}
                // {...bio}
                // placeholder={"자기소개 (150자 이내)"}
                // required={false}
              />
              <CheckWrap style={{ width: constants.width / 1.6 }}>
                <CheckBox checked={marketing} onPress={() => onChangeMarketing()} />
                <CheckView>
                  <Sub>마케팅 정보 수신 동의 </Sub>
                </CheckView>
              </CheckWrap>

              <CheckWrap style={{ width: constants.width / 1.6 }}>
                <CheckBox
                  checked={pubOfStatisticBool && pubOfScheduleBool}
                  onPress={() => {
                    if (pubOfStatisticBool && pubOfScheduleBool) {
                      setpubOfStatisticBool(false)
                      setpubOfScheduleBool(false)
                    } else {
                      setpubOfStatisticBool(true)
                      setpubOfScheduleBool(true)
                    }
                  }}
                />
                <CheckView>
                  <Sub>개인 데이터 모두 공개 </Sub>
                </CheckView>
                <TouchableOpacity onPress={() => setModalPlayVisible(!modalPlayVisible)}>
                  <Sub1>(공개 범위 선택)</Sub1>
                </TouchableOpacity>
              </CheckWrap>
              <AuthButton
                color="white"
                bgColor={"#0f4c82"}
                loading={acLoading}
                onPress={onEditAccount}
                text="수정"
                marginArray={[0, 0, 0, 0]}
              />
              <Modal
                isVisible={modalPlayVisible}
                onBackdropPress={() => setModalPlayVisible(false)}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: Math.round(Dimensions.get("window").height),
                }}
              >
                <StyledPlayModalContainer>
                  <ModalSubView>
                    <PlaySetText>개인 데이터 공개 범위 선택</PlaySetText>
                  </ModalSubView>
                  <PlayBottom>
                    <Container>
                      <CheckBox
                        checked={pubOfStatisticBool}
                        onPress={() => setpubOfStatisticBool(!pubOfStatisticBool)}
                      />
                      <CheckView>
                        <Sub>통계 공개</Sub>
                      </CheckView>
                    </Container>
                    <Container>
                      <CheckBox
                        checked={pubOfScheduleBool}
                        onPress={() => setpubOfScheduleBool(!pubOfScheduleBool)}
                      />
                      <CheckView>
                        <Sub>스케줄 공개</Sub>
                      </CheckView>
                    </Container>
                  </PlayBottom>
                  <ModalPlay>
                    <AuthButton
                      onPress={() => {
                        setModalPlayVisible(!modalPlayVisible)
                      }}
                      text="닫기"
                      color="white"
                      bgColor={"#7BA9EB"}
                      widthRatio={LastWidth(1, 2, 4)}
                    />
                  </ModalPlay>
                </StyledPlayModalContainer>
              </Modal>
              {/* </ScrollView> */}
            </EmptyView>
          ) : (
            <EmptyView>
              <AuthInput
                paddingArray={[5, 5, 5, 5]}
                {...password_pre}
                placeholder="이전 비밀번호 (예: ABCD1234)"
                returnKeyType="send"
                autoCorrect={false}
                secureTextEntry={true}
              />
              {password.errorChk && (
                <ErrorView>
                  <Text style={{ color: "red" }}>비밀번호는 6글자 이상이어야 합니다</Text>
                </ErrorView>
              )}
              <MarginR style={{ height: constants.height / 50 }} />

              <AuthInput
                paddingArray={[5, 5, 5, 5]}
                {...password}
                placeholder="새 비밀번호 (예: ABCD1234)"
                returnKeyType="send"
                autoCorrect={false}
                secureTextEntry={true}
              />
              {password2.errorChk && (
                <ErrorView>
                  <Text style={{ color: "red" }}>비밀번호가 일치하지 않습니다</Text>
                </ErrorView>
              )}
              <MarginR style={{ height: constants.height / 90 }} />

              <AuthInput
                paddingArray={[5, 5, 5, 5]}
                {...password2}
                placeholder="새 비밀번호 확인 (예: ABCD1234)"
                returnKeyType="send"
                autoCorrect={false}
                secureTextEntry={true}
              />
              <MarginR style={{ height: constants.height / 50 }} />

              <AuthButton
                color="white"
                bgColor={"#0f4c82"}
                loading={acLoading}
                onPress={onEditPassword}
                text="수정"
                marginArray={[0, 0, 0, 0]}
              />
            </EmptyView>
          )}
        </MainView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  )
}

export default EditProfile

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
