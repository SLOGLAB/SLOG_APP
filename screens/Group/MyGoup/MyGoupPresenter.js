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
  flex-direction: row;
  border-radius: 10;
  padding: 10px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(199, 199, 199, 1);
`
const Groupup = styled.View`
  flex: 0.1;
  width: 90%;
  justify-content: center;
  align-items: center;
`
const BoxIn = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
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
  /* position: absolute; */
  height: 30%;
  width: 10%;
`
const BoxLView = styled.View`
  /* position: absolute; */
  height: 100%;
  width: 90%;
  justify-content: center;
`
export default ({ groupData, groupRefetch, onBookmark, navigation }) => {
  groupData.sort(function (a, b) {
    return a.bookmark === true && b.bookmark !== true
      ? -1
      : a.bookmark !== true && b.bookmark === true
      ? 1
      : 0
  })
  useEffect(() => {
    groupRefetch()
  }, [])
  return (
    <MainView>
      <Groupup>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SearchGroupContainer")
          }}
        >
          <Icon
            name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
            size={25}
            color={"#224C7E"}
          />
        </TouchableOpacity>
      </Groupup>
      {groupData.length < 1 ? (
        <GroupBox>
          <BoxIn>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchGroupContainer")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
                size={45}
                color={"#224C7E"}
              />
            </TouchableOpacity>
          </BoxIn>
        </GroupBox>
      ) : (
        <GroupBox>
          <BoxLView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: groupData[0].id })
              }}
            >
              <GroupCate>{groupData[0].category}</GroupCate>
              <GroupName>{groupData[0].name}</GroupName>
              <GroupText>최소 학습 시간 : {groupData[0].targetTime}</GroupText>
              <GroupText>
                인원 : {groupData[0].memberCount}/{groupData[0].maxMember}
              </GroupText>
              <GroupText>방장 : {groupData[0].manager.username}</GroupText>
              <GroupText>{groupData[0].publicBool ? "공개방" : "비공개방"}</GroupText>
            </TouchableOpacity>
          </BoxLView>
          <BoxTopView>
            <TouchableOpacity
              onPress={() => {
                onBookmark(groupData[0].id, !groupData[0].bookmark)
              }}
            >
              {groupData[0].bookmark ? (
                <Icon
                  name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                  color={"#FFFD54"}
                  size={25}
                />
              ) : (
                <Icon
                  name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                  size={25}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          </BoxTopView>
        </GroupBox>
      )}
      <LineView />
      {groupData.length < 2 ? (
        <GroupBox>
          <BoxIn>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchGroupContainer")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
                size={45}
                color={"#224C7E"}
              />
            </TouchableOpacity>
          </BoxIn>
        </GroupBox>
      ) : (
        <GroupBox>
          <BoxLView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: groupData[1].id })
              }}
            >
              <GroupCate>{groupData[1].category}</GroupCate>
              <GroupName>{groupData[1].name}</GroupName>
              <GroupText>최소 학습 시간 : {groupData[1].targetTime}</GroupText>
              <GroupText>
                인원 : {groupData[1].memberCount}/{groupData[1].maxMember}
              </GroupText>
              <GroupText>방장 : {groupData[1].manager.username}</GroupText>
              <GroupText>{groupData[1].publicBool ? "공개방" : "비공개방"}</GroupText>
            </TouchableOpacity>
          </BoxLView>
          <BoxTopView>
            <TouchableOpacity
              onPress={() => {
                onBookmark(groupData[1].id, !groupData[1].bookmark)
              }}
            >
              {groupData[1].bookmark ? (
                <Icon
                  name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                  color={"#FFFD54"}
                  size={25}
                />
              ) : (
                <Icon
                  name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                  size={25}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          </BoxTopView>
        </GroupBox>
      )}
      <LineView />
      {groupData.length < 3 ? (
        <GroupBox>
          <BoxIn>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchGroupContainer")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
                size={45}
                color={"#224C7E"}
              />
            </TouchableOpacity>
          </BoxIn>
        </GroupBox>
      ) : (
        <GroupBox>
          <BoxLView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: groupData[2].id })
              }}
            >
              <GroupCate>{groupData[2].category}</GroupCate>
              <GroupName>{groupData[2].name}</GroupName>
              <GroupText>최소 학습 시간 : {groupData[2].targetTime}</GroupText>
              <GroupText>
                인원 : {groupData[2].memberCount}/{groupData[2].maxMember}
              </GroupText>
              <GroupText>방장 : {groupData[2].manager.username}</GroupText>
              <GroupText>{groupData[2].publicBool ? "공개방" : "비공개방"}</GroupText>
            </TouchableOpacity>
          </BoxLView>
          <BoxTopView>
            <TouchableOpacity
              onPress={() => {
                onBookmark(groupData[2].id, !groupData[2].bookmark)
              }}
            >
              {groupData[2].bookmark ? (
                <Icon
                  name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                  color={"#FFFD54"}
                  size={25}
                />
              ) : (
                <Icon
                  name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                  size={25}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          </BoxTopView>
        </GroupBox>
      )}
      <LineView />
    </MainView>
  )
}
