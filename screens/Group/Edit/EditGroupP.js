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
  Image,
  KeyboardAvoidingView,
} from "react-native"
import constants from "../../../constants"
import AuthButton from "../../../components/AuthButton"
import AuthInput from "../../../components/AuthInput"
import NavBlackIcon from "../../../components/NavBlackIcon"
import AuthInputline from "../../../components/AuthInputline"
import Modal from "react-native-modal"
import RNPickerSelect from "react-native-picker-select"
import LastWidth from "../../../components/LastWidth"
// import Textarea from "../../../components/Textarea"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import BackButton from "../../../components/BackButton"
import NumericInput from "react-native-numeric-input"
import { Container, Header, Content } from "native-base"
import axios from "axios"

const EmptyView = styled.View`
  /* flex: 1; */
  align-items: center;
  /* justify-content: center; */
  /* height: ${constants.height / 1}; */
  flex: 1;
  /* background-color: rgba(196, 196, 196, 1); */
`

const View2 = styled.View`
  height: 11%;
  justify-content: center;
  align-items: flex-end;
  flex-direction: row;
  /* background-color: "rgba(123, 169, 234, 1)"; */
`
const AndroidView2 = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex: 0.2;
  /* background-color: "rgba(123, 169, 234, 1)"; */
`
const ColorView = styled.View`
  padding: 40px;
  border-radius: 10;
  border-width: 0;
  width: 100%;
`

const CheckWrap = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const MarginR = styled.View``

const Title = styled.Text`
  font-size: 18;
  font-family: "GmarketBold";

  margin-bottom: 15;
`

const Sub = styled.Text`
  font-size: 13;
  font-family: "GmarketMedium";
`
const SelectView = styled.View``
const SelectRowView = styled.View`
  flex-direction: row;
  align-items: center;
`
const MainView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`
const SubView = styled.View`
  flex: 1;
`
const SubView1 = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
const MainText = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #0f4c82;
`
const MainText2 = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #ffffff;
`
export default ({
  navigation,
  name,
  bio,
  password,
  studyGroup,
  data,
  editGroupMutation,
  GroupId,
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

  const [startScheduleTerm, setstartScheduleTerm] = useState(data.maxMember)
  const [extensionTerm, setextensionTerm] = useState(data.targetTime)
  const [acLoading, setAcLoading] = useState(false)
  const [selectFile, setSelectFile] = useState(data.imgUrl)
  const getPhoto = navigation.getParam("photo")

  const onEditGroup = async (e) => {
    if (startScheduleTerm < 2 || startScheduleTerm > 50) {
      Alert.alert("수용인원을 2~50명 이내로 설정하세요.")
      return
    } else if (extensionTerm < 1 || extensionTerm > 18) {
      Alert.alert("최소 학습 시간을 1~18시간 이내로 설정하세요.")
      return
    }
    try {
      const formData = new FormData()
      if (getPhoto !== undefined) {
        const name = getPhoto.filename
        const [, type] = name.split(".")
        formData.append("file", {
          name,
          type: "image/" + type.toLowerCase(),
          uri: getPhoto.uri,
        })
      }
      const { data } = await axios.post(
        "https://slog-deeptime-backend.herokuapp.com/api/upload/avatar",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      setAcLoading(true)
      const {
        data: { editGroup },
      } = await editGroupMutation({
        variables: {
          groupId: GroupId,
          name: name.value,
          maxMember: startScheduleTerm,
          category: studyGroup.value,
          targetTime: extensionTerm,
          password: password.value,
          bio: bio.value,
          imgUrl: getPhoto ? data.location : "",
          imgKey: getPhoto ? data.key : "",
        },
      })
      if (!editGroup) {
        Alert.alert("그룹을 수정할 수 없습니다.")
      }
    } catch (e) {
      console.log(e)
    } finally {
      setAcLoading(false)
      navigation.navigate("OneGroupContainer")
    }
  }
  return (
    <EmptyView>
      <Container>
        <Header>
          <MainView>
            <SubView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("OneGroupContainer")
                }}
              >
                <NavBlackIcon
                  name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                />
              </TouchableOpacity>
            </SubView>
            <SubView1>
              {Platform.OS === "ios" ? (
                <MainText>그룹 수정</MainText>
              ) : (
                <MainText2>그룹 수정</MainText2>
              )}
            </SubView1>
            <SubView></SubView>
          </MainView>
        </Header>
        <Content>
          <KeyboardAwareScrollView behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <ColorView>
              <SelectRowView style={{ width: constants.width / 1.3 }}>
                <AuthInput
                  paddingArray={[5, 5, 5, 5]}
                  {...name}
                  placeholder="(필수) 그룹 이름"
                  returnKeyType="done"
                  autoCorrect={false}
                  widthRatio={1.3}
                />
              </SelectRowView>
              <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />
              <SelectRowView style={{ width: constants.width / 1.3 }}>
                <Sub>수용인원(2-30): </Sub>
                <NumericInput
                  value={startScheduleTerm}
                  onChange={(value) => setstartScheduleTerm(value)}
                  totalWidth={80}
                  totalHeight={35}
                  iconSize={25}
                  rounded
                  type="up-down"
                  minValue={0}
                  maxValue={30}
                  step={1}
                  valueType="real"
                  rounded
                  validateOnBlur
                  textColor="#B0228C"
                  iconStyle={{ color: "black" }}
                  rightButtonBackgroundColor="#EA3788"
                  leftButtonBackgroundColor="#E56B70"
                />
                <Sub>명</Sub>
              </SelectRowView>
              <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />

              <SelectView style={{ width: constants.width / 1.3 }}>
                <RNPickerSelect
                  {...studyGroup}
                  style={style_tmp}
                  placeholder={{
                    label: "카테고리...",
                    value: null,
                    color: "red",
                  }}
                />
              </SelectView>
              <SelectRowView style={{ width: constants.width / 1.3 }}>
                <Sub>최소 학습 시간(1-18): </Sub>
                <NumericInput
                  value={extensionTerm}
                  onChange={(value) => setextensionTerm(value)}
                  totalWidth={80}
                  totalHeight={35}
                  iconSize={25}
                  rounded
                  type="up-down"
                  minValue={0}
                  maxValue={18}
                  step={1}
                  valueType="real"
                  rounded
                  validateOnBlur
                  textColor="#B0228C"
                  iconStyle={{ color: "black" }}
                  rightButtonBackgroundColor="#EA3788"
                  leftButtonBackgroundColor="#E56B70"
                />
                <Sub>시간</Sub>
              </SelectRowView>
              <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />

              <AuthInput
                paddingArray={[5, 5, 5, 5]}
                {...password}
                placeholder="(선택)비밀번호"
                returnKeyType="done"
                autoCorrect={false}
                secureTextEntry={true}
                widthRatio={1.3}
              />
              <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />
              <AuthInputline
                paddingArray={[0, 0, 10, 5]}
                numberOfLines={1}
                {...bio}
                placeholder="그룹소개 "
                returnKeyType="done"
                autoCorrect={false}
                widthRatio={1.3}
                style={{ height: 100 }}

                // textAlignVertical: "top"
              />
              <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SelectGroupPhoto", { id: "EditGroup" })
                }}
              >
                <Image
                  source={{ uri: getPhoto === undefined ? selectFile : getPhoto.uri }}
                  style={{ height: 150 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <MarginR style={{ width: constants.width / 40, marginBottom: 10 }} />

              {/* </SelectView> */}
              <CheckWrap>
                <AuthButton
                  color="white"
                  bgColor={"#0f4c82"}
                  loading={acLoading}
                  onPress={() => {
                    onEditGroup()
                  }}
                  text="수정"
                  widthRatio={LastWidth(1, 2, 5)}
                />
              </CheckWrap>
            </ColorView>
          </KeyboardAwareScrollView>
        </Content>
      </Container>
    </EmptyView>
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
