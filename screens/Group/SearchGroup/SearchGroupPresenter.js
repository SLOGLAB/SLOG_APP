import React from "react"
import { ScrollView, RefreshControl, Image } from "react-native"
import styled from "styled-components"
import AuthButton from "../../../components/AuthButton"

const GroupBox = styled.TouchableOpacity`
  width: 100%;
  justify-content: flex-start;
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
const GroupCate = styled.Text`
  font-family: "GmarketMedium";
  color: rgba(34, 76, 126, 1);
  font-size: 10;
`
const GroupText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 10;
  margin-right: 5;
`
const GroupGreyText = styled.Text`
  font-family: "GmarketMedium";
  color: #c7c7c7;
  font-size: 10;
  margin-right: 5;
`
const RowGroup = styled.View`
  flex-direction: row;
`
const BoxBottomView = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 5;
`
const dayArray = ["일", "월", "화", "수", "목", "금", "토"]

export default ({
  groupData,
  groupRefetch,
  navigation,
  onRefresh,
  refreshing,
  first,
  setFirst,
  feedTerm,
}) => {
  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}..` : text)

  return (
    <>
      <ScrollView
        style={{ backgroundColor: "#FFFFFF", marginBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={{ backgroundColor: "#FFFFFF" }}
          />
        }
      >
        {groupData.map((list) => (
          // {BoxCount.map((list) => (
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
              {/* <RowGroup>
                    <GroupGreyText>평균 학습량</GroupGreyText>
                    <GroupText>{Math.floor(list.lastStudyTime)}시간</GroupText>
                  </RowGroup> */}
              <RowGroup>
                <GroupGreyText>평균 출석률</GroupGreyText>
                <GroupText>{Math.floor(list.lastAttendance)}%</GroupText>
              </RowGroup>
              <RowGroup>
                <GroupGreyText>하루 목표</GroupGreyText>
                <GroupText>{list.targetTime}시간</GroupText>
              </RowGroup>

              <RowGroup>
                <GroupGreyText>인원</GroupGreyText>
                <GroupText>
                  {list.memberCount}/{list.maxMember}
                </GroupText>
                <GroupGreyText>방장</GroupGreyText>
                <GroupText>{list.manager.username}</GroupText>
              </RowGroup>

              <RowGroup>
                <GroupGreyText>활동 요일</GroupGreyText>
                <GroupText>
                  {list.activeDay.findIndex((e) => e == false) == -1
                    ? " 매일 "
                    : list.activeDay.map((bool, index) => {
                        if (bool) {
                          if (index === list.activeDay.lastIndexOf(true)) {
                            return dayArray[index]
                          } else {
                            return dayArray[index] + ","
                          }
                        }
                      })}
                </GroupText>
              </RowGroup>
              {/* <GroupText>
                    활동 요일 :
                    {list.activeDay.findIndex((e) => e == false) == -1
                      ? " 매일 "
                      : list.activeDay.map((bool, index) => {
                          if (bool) {
                            if (index === list.activeDay.lastIndexOf(true)) {
                              return dayArray[index]
                            } else {
                              return dayArray[index] + ","
                            }
                          }
                        })}
                  </GroupText> */}
            </BoxView>
          </GroupBox>
        ))}
      </ScrollView>
      <BoxBottomView>
        <AuthButton
          color="white"
          onPress={() => {
            setFirst(first + feedTerm)
          }}
          text="더보기"
          paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
          // widthRatio={LastWidth(1.7, 2.5, 40)}
        />
      </BoxBottomView>
    </>
  )
}
