import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import styled from "styled-components"
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
`
const LineView = styled.View`
  width: 100%;
  height: 5%;
`
const GroupName = styled.Text`
  font-family: "GmarketBold";
  color: rgba(34, 76, 126, 1);
`
// font-family: "GmarketLight";
// font-family: "GmarketBold";

export default ({ groupData, groupRefetch, onBookmark }) => {
  useEffect(() => {
    groupRefetch()
  }, [])
  return (
    <MainView>
      {groupData.length < 1 ? (
        <GroupBox></GroupBox>
      ) : (
        <GroupBox>
          <GroupName>{groupData[0].category}</GroupName>
        </GroupBox>
      )}
      <LineView />
      {groupData.length < 2 ? (
        <GroupBox></GroupBox>
      ) : (
        <GroupBox>
          <GroupName>{groupData[1].category}</GroupName>
        </GroupBox>
      )}
      <LineView />
      {groupData.length < 3 ? (
        <GroupBox></GroupBox>
      ) : (
        <GroupBox>
          <GroupName>{groupData[2].category}</GroupName>
        </GroupBox>
      )}
      <LineView />
    </MainView>
  )
}
