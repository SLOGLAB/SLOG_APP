import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"
import GroupSwiperBase from "../GroupStat/GroupSwiperBase"
const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1;
`
const GroupBox = styled.View`
  flex: 0.2;
  width: 100%;
  border-width: 1;
  justify-content: center;
  padding: 10px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(255, 255, 255, 1);
`
const LineView = styled.View`
  width: 100%;
  height: 5%;
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
  padding-left: 10;
  padding-top: 5;
  width: 100%;
`
const BoxTopView2 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10;
  width: 100%;
`
export default ({ groupData, navigation, myData, groupRefetch, loading }) => {
  useEffect(() => {}, [])
  return (
    <MainView>
      <BoxTopView>
        <TouchableOpacity onPress={() => navigation.navigate("TabNavigation")}>
          <Icon
            name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
            color={"#000000"}
            size={40}
          />
        </TouchableOpacity>
      </BoxTopView>
      <GroupBox>
        <BoxTopView2>
          <GroupCate>{groupData.category} </GroupCate>
          <GroupText>멤버 {groupData.memberCount}</GroupText>
        </BoxTopView2>
        <GroupName>{groupData.name}</GroupName>
        <ScrollView>
          <GroupText>{groupData.bio}</GroupText>
        </ScrollView>
      </GroupBox>
      <GroupSwiperBase
        groupData={groupData}
        groupRefetch={groupRefetch}
        loading={loading}
        navigation={navigation}
        myData={myData}
      />
    </MainView>
  )
}
