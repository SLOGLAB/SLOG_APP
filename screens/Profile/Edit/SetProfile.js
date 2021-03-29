import React, { useState, useEffect } from "react"
import styled from "styled-components"
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
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

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
export default ({
  navigation,
  data,
  loading,
  firstName,
  lastName,
  username,
  email,
  bio,
  emailKey,
  phoneNumber,
  phoneKey,
  studyPurpose,
  studyGroup,
  studyGroup2,
  studyGroup3,
  myAddress1,
  myAddress2,
  organizationName,
  detailAddress,
  marketing,
  onChangeMarketing,
  onEditAccount,
  onEditPassword,
  sPhoneOnClick,
  cPhoneOnClick,
  sEmailOnClick,
  cEmailOnClick,
  password_pre,
  password,
  password2,
  maxLen_11,
  vLoading,
  acLoading,
  pubOfStatisticBool,
  onChangePubOfStatistic,
  pubOfScheduleBool,
  onChangePubOfSchedule,
  setpubOfStatisticBool,
  setpubOfScheduleBool,
}) => {
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
              {/* <SelectView style={{ width: constants.width / 1.7 }}>
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
              {/* <Modal
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
              </Modal> */}
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
