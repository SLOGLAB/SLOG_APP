import React, { useState, useEffect } from "react"
import { Alert, ScrollView, RefreshControl, Dimensions } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"
import Modal from "react-native-modal"

const MainView = styled.View`
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1;
`
const TopView = styled.View`
  width: 100%;
  height: 15%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const FlexBox = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const FlexBox2 = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: 10;
`
const GroupBox = styled.View`
  flex: 0.15;
  width: 100%;
  border-width: 1;
  justify-content: center;
  border-radius: 10;
  padding: 15px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(199, 199, 199, 1);
  margin-bottom: 10px;
`
const LineView = styled.View`
  width: 100%;
  height: 2%;
`
const GroupName = styled.Text`
  font-family: "GmarketMedium";
  font-size: 20;
  /* margin-top: 5; */
  margin-bottom: 5;
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
const GroupBox2 = styled.View`
  flex: 0.3;
  width: 100%;
  border-width: 1;
  justify-content: center;
  padding: 10px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(255, 255, 255, 1);
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
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    groupRefetch()
  }, [])
  return (
    <MainView>
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
          <GroupName>그룹 검색</GroupName>
        </FlexBox>
        <FlexBox>
          <GroupName></GroupName>
        </FlexBox>
      </TopView>
      <ScrollView
        style={{ backgroundColor: "#FFFFFF" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={{ backgroundColor: "#FAFAFA" }}
          />
        }
      >
        {groupData.map((list) => (
          <GroupBox key={list.id}>
            <BoxTopView>
              <GroupCate>{list.category}</GroupCate>
            </BoxTopView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: list.id, search: true })
              }}
            >
              <GroupName>{list.name}</GroupName>
              <GroupText>최소 학습 시간 : {list.targetTime}</GroupText>
              <BoxTopView>
                <GroupText>
                  인원 : {list.memberCount}/{list.maxMember}
                </GroupText>
                <GroupText>방장 : {list.manager.username}</GroupText>
                <GroupText>{list.publicBool ? "공개방" : "비공개방"}</GroupText>
              </BoxTopView>
            </TouchableOpacity>
          </GroupBox>
        ))}
      </ScrollView>
    </MainView>
  )
}
