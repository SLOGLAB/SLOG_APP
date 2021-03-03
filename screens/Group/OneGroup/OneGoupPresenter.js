import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"

const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1;
`
const GroupBox = styled.View`
  flex: 0.3;
  width: 90%;
  border-width: 1;
  justify-content: center;
  border-radius: 10;
  padding: 10px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(199, 199, 199, 1);
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
  padding-right: 10;
`

export default ({ groupData, navigation }) => {
  useEffect(() => {}, [])
  return (
    <MainView>
      <TouchableOpacity onPress={() => navigation.navigate("TabNavigation")}>
        <Icon
          name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
          color={"#000000"}
          size={40}
        />
      </TouchableOpacity>
    </MainView>
  )
}
