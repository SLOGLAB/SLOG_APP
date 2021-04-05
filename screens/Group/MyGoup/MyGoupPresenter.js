import React, { useState, useEffect } from "react"
import { Alert, Image, Dimensions } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import styled from "styled-components"
import Icon from "../../../components/Icon"
var { height: HEIGHT, width: WIDTH } = Dimensions.get("window")

const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  /* border-width: 1; */
`
const GroupBox = styled.View`
  flex: 1;
  width: 100%;
  border-width: 1;
  justify-content: flex-end;
  flex-direction: row;
  /* border-radius: 10; */
  padding: 0px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(196, 196, 196, 1);
`
const Groupup = styled.View`
  flex: 0.05;
  width: 90%;
  justify-content: center;
  align-items: center;
`
const BoxIn = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
`
const LineView = styled.View`
  width: 100%;
  height: 0;
  border-width: 0;
`
const GroupName = styled.Text`
  font-family: "GmarketMedium";
  font-size: 18;
  /* margin-top: 5; */
`
const GroupCate = styled.Text`
  font-family: "GmarketMedium";
  color: rgba(34, 76, 126, 1);
`
const GroupText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 13;
  margin-right: 5;
`
const GroupGreyText = styled.Text`
  font-family: "GmarketMedium";
  color: #c7c7c7;
  font-size: 13;
  margin-right: 5;
`
const RowGroup = styled.View`
  flex-direction: row;
`
const BoxSBView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
const BoxTopView = styled.View`
  flex-direction: row;
  /* justify-content: space-between; */
  position: absolute;
  height: 35;
  width: 35;
  justify-content: center;
`
const BoxLView = styled.View`
  /* position: absolute; */
  height: 100%;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  background-color: rgba(255, 255, 255, 1);
`
const BoxView = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
`
const BoxRView = styled.View`
  flex: 1;
  padding-left: 10;
  justify-content: center;
`
const dayArray = ["일", "월", "화", "수", "목", "금", "토"]

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
      {/* <LineView /> */}
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
            <BoxView
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: groupData[0].id })
              }}
            >
              <Image
                source={{ uri: groupData[0].imgUrl }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </BoxView>
            <BoxRView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("OneGroupContainer", { id: groupData[0].id })
                }}
              >
                <GroupCate>{groupData[0].category}</GroupCate>
                <GroupName>{groupData[0].name}</GroupName>
                <RowGroup>
                  <GroupGreyText>하루 목표</GroupGreyText>
                  <GroupText>{groupData[0].targetTime}시간</GroupText>
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>인원</GroupGreyText>
                  <GroupText>
                    {groupData[0].memberCount}/{groupData[0].maxMember}
                  </GroupText>
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>방장</GroupGreyText>
                  <GroupText>{groupData[0].manager.username}</GroupText>
                  {/* <GroupText>{groupData[0].publicBool ? "공개방" : "비공개방"}</GroupText> */}
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>활동 요일</GroupGreyText>

                  <GroupText>
                    {groupData[0].activeDay.findIndex((e) => e == false) == -1
                      ? " 매일 "
                      : groupData[0].activeDay.map((bool, index) => {
                          if (bool) {
                            if (index === groupData[0].activeDay.lastIndexOf(true)) {
                              return dayArray[index]
                            } else {
                              return dayArray[index] + ","
                            }
                          }
                        })}
                  </GroupText>
                </RowGroup>
              </TouchableOpacity>
            </BoxRView>
          </BoxLView>
          <BoxTopView>
            <TouchableOpacity
              onPress={() => {
                onBookmark(groupData[0].id, !groupData[0].bookmark)
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                color={groupData[0].bookmark ? "#FFFD54" : "#C4C4C4"}
                size={30}
              />
            </TouchableOpacity>
          </BoxTopView>
        </GroupBox>
      )}
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
            <BoxView
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: groupData[1].id })
              }}
            >
              <Image
                source={{ uri: groupData[1].imgUrl }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </BoxView>
            <BoxRView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("OneGroupContainer", { id: groupData[1].id })
                }}
              >
                <GroupCate>{groupData[1].category}</GroupCate>
                <GroupName>{groupData[1].name}</GroupName>
                <RowGroup>
                  <GroupGreyText>하루 목표</GroupGreyText>
                  <GroupText>{groupData[1].targetTime}시간</GroupText>
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>인원</GroupGreyText>
                  <GroupText>
                    {groupData[1].memberCount}/{groupData[1].maxMember}
                  </GroupText>
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>방장</GroupGreyText>
                  <GroupText>{groupData[1].manager.username}</GroupText>
                  {/* <GroupText>{groupData[1].publicBool ? "공개방" : "비공개방"}</GroupText> */}
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>활동 요일</GroupGreyText>

                  <GroupText>
                    {groupData[1].activeDay.findIndex((e) => e == false) == -1
                      ? " 매일 "
                      : groupData[1].activeDay.map((bool, index) => {
                          if (bool) {
                            if (index === groupData[1].activeDay.lastIndexOf(true)) {
                              return dayArray[index]
                            } else {
                              return dayArray[index] + ","
                            }
                          }
                        })}
                  </GroupText>
                </RowGroup>
              </TouchableOpacity>
            </BoxRView>
          </BoxLView>
          <BoxTopView>
            <TouchableOpacity
              onPress={() => {
                onBookmark(groupData[1].id, !groupData[1].bookmark)
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                color={groupData[1].bookmark ? "#FFFD54" : "#C4C4C4"}
                size={30}
              />
            </TouchableOpacity>
          </BoxTopView>
        </GroupBox>
      )}
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
            <BoxView
              onPress={() => {
                navigation.navigate("OneGroupContainer", { id: groupData[2].id })
              }}
            >
              <Image
                source={{ uri: groupData[2].imgUrl }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </BoxView>
            <BoxRView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("OneGroupContainer", { id: groupData[2].id })
                }}
              >
                <GroupCate>{groupData[2].category}</GroupCate>
                <GroupName>{groupData[2].name}</GroupName>
                <RowGroup>
                  <GroupGreyText>하루 목표</GroupGreyText>
                  <GroupText>{groupData[2].targetTime}시간</GroupText>
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>인원</GroupGreyText>
                  <GroupText>
                    {groupData[2].memberCount}/{groupData[2].maxMember}
                  </GroupText>
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>방장</GroupGreyText>
                  <GroupText>{groupData[2].manager.username}</GroupText>
                  {/* <GroupText>{groupData[2].publicBool ? "공개방" : "비공개방"}</GroupText> */}
                </RowGroup>
                <RowGroup>
                  <GroupGreyText>활동 요일</GroupGreyText>

                  <GroupText>
                    {groupData[2].activeDay.findIndex((e) => e == false) == -1
                      ? " 매일 "
                      : groupData[2].activeDay.map((bool, index) => {
                          if (bool) {
                            if (index === groupData[2].activeDay.lastIndexOf(true)) {
                              return dayArray[index]
                            } else {
                              return dayArray[index] + ","
                            }
                          }
                        })}
                  </GroupText>
                </RowGroup>
              </TouchableOpacity>
            </BoxRView>
          </BoxLView>
          <BoxTopView>
            <TouchableOpacity
              onPress={() => {
                onBookmark(groupData[2].id, !groupData[2].bookmark)
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-star" : "md-star"}
                color={groupData[2].bookmark ? "#FFFD54" : "#C4C4C4"}
                size={30}
              />
            </TouchableOpacity>
          </BoxTopView>
        </GroupBox>
      )}
      {/* <LineView /> */}
    </MainView>
  )
}
