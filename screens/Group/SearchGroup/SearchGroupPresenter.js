import React, { useState, useEffect } from "react"
import {
  Alert,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import { studyOption_group0 } from "../../../components/LongArray"
import constants from "../../../constants"
import { Container, Header, Content } from "native-base"

import useSelect from "../../../hooks/useSelect"
import Modal from "react-native-modal"
import SearchGroupButton from "./SearchGroupButton"
var { height: HEIGHT, width: WIDTH } = Dimensions.get("window")

const TopView = styled.View`
  /* width: 100%;
  height: ${constants.height / 15}; */

  flex-direction: row;
  /* border-bottom-width: 0.2; */
  flex: 1;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 10px; */
`
const TopEm = styled.View``
const FlexBox = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const FlexTouchBox = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const FlexBox2 = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: 10;
`
const GroupBox = styled.TouchableOpacity`
  width: 100%;
  border-width: 1;
  justify-content: center;
  /* border-radius: 10; */
  padding: 2px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  /* margin-left: 10px;
  margin-right: 10px; */
  flex-direction: row;
`
const BoxView = styled.View`
  flex: 1;
  margin-left: 5px;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
`
const GroupName = styled.Text`
  font-family: "GmarketMedium";
  font-size: 13;
  /* margin-top: 5; */
  margin-bottom: 1;
`
const GrouptopName = styled.Text`
  font-family: "GmarketBold";
  font-size: 18;
  /* margin-top: 5; */
  margin-bottom: 5;
  color: rgba(34, 76, 126, 1);
`
const GroupCate = styled.Text`
  font-family: "GmarketMedium";
  color: rgba(34, 76, 126, 1);
`
const GroupText = styled.Text`
  font-family: "GmarketLight";
`
const BoxTopView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10;
`
const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.7;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const BoxTopView2 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10;
  width: 100%;
`
const ButtonText = styled.Text`
  font-size: 15;
  margin-left: 5;
  margin-bottom: 3;
  font-family: "GmarketMedium";
`
const Button2Text = styled.Text`
  font-size: 15;
  margin-left: 5;
  margin-bottom: 3;
  font-family: "GmarketMedium";
  color: #ffffff;
`
const SelectView = styled.View`
  margin-bottom: 10;
  margin-left: 10;
  margin-top: 10;
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
const Box = styled.View``
export default ({
  groupData,
  groupRefetch,
  navigation,
  onRefresh,
  refreshing,
  setRefreshing,
  modlaOutMember,
  setmodlaOutMember,
  myData,
  loading,
  groupData2,
  groupRefetch2,
  gruupLoading,
}) => {
  //   groupData.sort(function (a, b) {
  //     return a.bookmark === true && b.bookmark !== true
  //       ? -1
  //       : a.bookmark !== true && b.bookmark === true
  //       ? 1
  //       : 0
  //   })
  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}..` : text)

  const [purpose, setpurpose] = useState("전체")
  const [filData, setFilData] = useState(groupData)

  const getData = () => {
    if (purpose === "전체") {
      setFilData(groupData)
    } else {
      const filGroup = groupData.filter((ctr) => ctr.category === purpose)
      setFilData(filGroup)
    }
  }
  useEffect(() => {
    getData()
  }, [purpose])

  useEffect(() => {
    groupRefetch()
  }, [])
  return (
    <>
      <Container>
        <Header hasTabs>
          <TopView>
            <FlexBox2>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TabNavigation")
                }}
              >
                <Icon
                  name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                  color={"#000000"}
                  size={40}
                />
              </TouchableOpacity>
            </FlexBox2>
            <FlexBox>
              {Platform.OS === "ios" ? (
                <MainText>그룹 검색</MainText>
              ) : (
                <MainText2>그룹 검색</MainText2>
              )}
            </FlexBox>
            <FlexTouchBox
              onPress={() => {
                navigation.navigate("CreateGroupContainer")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-add" : "md-add"}
                color={Platform.OS === "ios" ? "#000000" : "#ffffff"}
                size={30}
              />
              {Platform.OS === "ios" ? (
                <ButtonText>그룹 만들기</ButtonText>
              ) : (
                <Button2Text>그룹 만들기</Button2Text>
              )}
            </FlexTouchBox>
          </TopView>
        </Header>
        <Content>
          <SelectView style={{ width: constants.width / 2.5 }}>
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setpurpose(value)
                }
              }}
              items={studyOption_group0}
              value={purpose} //선택된 과목이 어떻게 들어가는지 봐야함
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 9,
                  right: 10,
                },
                placeholder: {
                  color: "black",
                  fontSize: 14,
                  fontWeight: "bold",
                },
              }}
              Icon={() => {
                return (
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                    size={24}
                    color="gray"
                  />
                )
              }}
            />
          </SelectView>
          <ScrollView
            style={{ backgroundColor: "#FFFFFF", marginBottom: 80 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                style={{ backgroundColor: "#FFFFFF" }}
              />
            }
          >
            {filData.map((list) => (
              <GroupBox
                key={list.id}
                onPress={() => {
                  navigation.navigate("OneGroupContainer", { id: list.id, search: true })
                }}
              >
                <Image source={{ uri: list.imgUrl }} style={{ flex: 1 }} resizeMode="contain" />
                <BoxView>
                  <GroupCate>{list.category}</GroupCate>

                  <GroupName>{trimText(list.name, 19)}</GroupName>
                  <GroupText>최소 학습 시간 : {list.targetTime}</GroupText>
                  <GroupText>
                    인원 : {list.memberCount}/{list.maxMember}
                  </GroupText>
                  <GroupText>방장 : {list.manager.username}</GroupText>
                  <GroupText>{list.publicBool ? "공개방" : "비공개방"}</GroupText>
                </BoxView>
              </GroupBox>
            ))}
          </ScrollView>
        </Content>
      </Container>
    </>
  )
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
  },
  seprator: {
    height: 10,
    width: 200,
    margin: 10,
  },
})
