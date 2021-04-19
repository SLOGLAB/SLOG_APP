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
import { Container, Header, Content, CheckBox } from "native-base"
import AuthButton from "../../../components/AuthButton"
import useSelect from "../../../hooks/useSelect"
import Modal from "react-native-modal"
import SearchGroupButton from "./SearchGroupButton"
var { height: HEIGHT, width: WIDTH } = Dimensions.get("window")

const TopView = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
`
const TopView1 = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* background-color: rgba(234, 50, 35, 1); */
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
const CheckText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 13;
  margin-left: 20;
  margin-right: 5;
  /* margin-top: 5; */
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
  margin-left: 0;
  margin-top: 10;
  justify-content: flex-start;
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
const dayArray = ["일", "월", "화", "수", "목", "금", "토"]
let BoxCount = 3
export default ({ groupData, groupRefetch, navigation, onRefresh, refreshing }) => {
  //   groupData.sort(function (a, b) {
  //     return a.bookmark === true && b.bookmark !== true
  //       ? -1
  //       : a.bookmark !== true && b.bookmark === true
  //       ? 1
  //       : 0
  //   })
  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}..` : text)
  const arr3 = [
    { label: "높은 시간순", value: "높은 시간순" },
    { label: "낮은 시간순", value: "낮은 시간순" },
    { label: "높은 출석률순", value: "높은 출석률순" },
    { label: "낮은 출석률순", value: "낮은 출석률순" },
  ]

  const [purpose, setpurpose] = useState("전체")
  const [timesort, settimesort] = useState("높은 시간순")
  const [checkBox, setcheckBox] = useState(false)
  const [checkBox1, setcheckBox1] = useState(false)

  // const timeSort = () => {
  //   if (timesort === "낮은 시간순") {
  //     fileData.sort(function (a, b) {
  //       return b.lastStudyTime - a.lastStudyTime
  //     })
  //   } else if (timesort === "높은 시간순") {
  //     fileData.sort(function (a, b) {
  //       return a.lastStudyTime - b.lastStudyTime
  //     })
  //   } else if (timesort === "높은 출석률순") {
  //     fileData.sort(function (a, b) {
  //       return a.lastAttendance - b.lastAttendance
  //     })
  //   } else if (timesort === "낮은 출석률순") {
  //     fileData.sort(function (a, b) {
  //       return b.lastAttendance - a.lastAttendance
  //     })
  //   }
  // }

  const [fileData, setFileData] = useState([])

  const groupTerm = 20
  // const countHandle = () => {
  //   setVariables({ first: variables.first + groupTerm })
  //   if (purpose === "전체") {
  //     setFileData(groupData.slice(0, variables.first + groupTerm))
  //   } else {
  //     const filGroup = groupData.filter((ctr) => ctr.category === purpose)
  //     setFileData(filGroup.slice(0, variables.first + groupTerm))
  //   }
  //   if (checkBox) {
  //     const filGroup = fileData.filter((ctr) => ctr.publicBool === true)
  //     setFileData(filGroup)
  //   }
  //   if (checkBox1) {
  //     const filGroup = fileData.filter((ctr) => ctr.maxMember > ctr.memberCount)
  //     setFileData(filGroup)
  //   }
  // }
  // const getData = () => {
  //   if (purpose === "전체") {
  //     // setFileData(groupData.slice(0, groupTerm))
  //     setFileData(groupData)
  //   } else {
  //     const filGroup = groupData.filter((ctr) => ctr.category === purpose)
  //     // setFileData(filGroup.slice(0, groupTerm))
  //     setFileData(filGroup)
  //   }
  // }
  // const publicHandler = () => {
  //   if (checkBox) {
  //     const filecheckGroup = fileData.filter((ctr) => ctr.publicBool === true)
  //     setFileData(filecheckGroup)
  //   }
  // }
  // const emptyHandle = () => {
  //   if (checkBox1) {
  //     const fileEmptyGroup = fileData.filter((ctr) => ctr.maxMember > ctr.memberCount)
  //     setFileData(fileEmptyGroup)
  //   }
  // }
  const countHandle = () => {
    BoxCount += groupTerm
    if (purpose === "전체") {
      if (checkBox) {
        if (checkBox1) {
          const filecheckGroup = groupData.filter((ctr) => ctr.publicBool === true)
          const fileEmptyGroup = filecheckGroup.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(fileEmptyGroup.slice(0, BoxCount))
        } else {
          const filecheckGroup = groupData.filter((ctr) => ctr.publicBool === true)
          setFileData(filecheckGroup.slice(0, BoxCount))
        }
      } else {
        if (checkBox1) {
          const filecheckGroup = groupData.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(filecheckGroup.slice(0, BoxCount))
        } else {
          setFileData(groupData.slice(0, BoxCount))
        }
      }
    } else {
      const filGroup = groupData.filter((ctr) => ctr.category === purpose)
      if (checkBox) {
        if (checkBox1) {
          const filecheckGroup = filGroup.filter((ctr) => ctr.publicBool === true)

          const fileEmptyGroup = filecheckGroup.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(fileEmptyGroup.slice(0, BoxCount))
        } else {
          const filecheckGroup = filGroup.filter((ctr) => ctr.publicBool === true)
          setFileData(filecheckGroup.slice(0, BoxCount))
        }
      } else {
        if (checkBox1) {
          const fileEmptyGroup = filGroup.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(fileEmptyGroup.slice(0, BoxCount))
        } else {
          setFileData(filGroup.slice(0, BoxCount))
        }
      }
    }
  }
  const getData = () => {
    BoxCount = groupTerm
    setFileData([])
    if (purpose === "전체") {
      if (checkBox) {
        if (checkBox1) {
          const filecheckGroup = groupData.filter((ctr) => ctr.publicBool === true)
          const fileEmptyGroup = filecheckGroup.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(fileEmptyGroup.slice(0, BoxCount))
        } else {
          const filecheckGroup = groupData.filter((ctr) => ctr.publicBool === true)
          setFileData(filecheckGroup.slice(0, BoxCount))
        }
      } else {
        if (checkBox1) {
          const filecheckGroup = groupData.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(filecheckGroup.slice(0, BoxCount))
        } else {
          setFileData(groupData.slice(0, BoxCount))
        }
      }
    } else {
      const filGroup = groupData.filter((ctr) => ctr.category === purpose)
      if (checkBox) {
        if (checkBox1) {
          const filecheckGroup = filGroup.filter((ctr) => ctr.publicBool === true)

          const fileEmptyGroup = filecheckGroup.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(fileEmptyGroup.slice(0, BoxCount))
        } else {
          const filecheckGroup = filGroup.filter((ctr) => ctr.publicBool === true)
          setFileData(filecheckGroup.slice(0, BoxCount))
        }
      } else {
        if (checkBox1) {
          const fileEmptyGroup = filGroup.filter((ctr) => ctr.maxMember > ctr.memberCount)
          setFileData(fileEmptyGroup.slice(0, BoxCount))
        } else {
          setFileData(filGroup.slice(0, BoxCount))
        }
      }
    }
  }
  const publicHandler = () => {
    if (checkBox) {
      const filecheckGroup = fileData.filter((ctr) => ctr.publicBool === true)
      setFileData(filecheckGroup)
    }
  }
  const emptyHandle = () => {
    if (checkBox1) {
      const fileEmptyGroup = fileData.filter((ctr) => ctr.maxMember > ctr.memberCount)
      setFileData(fileEmptyGroup)
    }
  }
  useEffect(() => {
    getData()
    // publicHandler()
    // emptyHandle()
    // timeSort()
  }, [
    purpose,
    checkBox1,
    checkBox,
    // timesort
  ])

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
          <SelectView style={{ width: constants.width / 1, flexDirection: "row" }}>
            <TopView>
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
            </TopView>
            {/* <TopView>
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value !== null) {
                    settimesort(value)
                  }
                }}
                items={arr3}
                value={timesort} //선택된 과목이 어떻게 들어가는지 봐야함
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
            </TopView> */}
            <FlexBox>
              <TopView1>
                <CheckBox
                  checked={checkBox}
                  onPress={() => {
                    setcheckBox(!checkBox)
                  }}
                />
                <CheckText>공개</CheckText>
              </TopView1>
              <TopView1>
                <CheckBox
                  checked={checkBox1}
                  onPress={() => {
                    setcheckBox1(!checkBox1)
                  }}
                />

                <CheckText>빈방</CheckText>
              </TopView1>
            </FlexBox>
          </SelectView>
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
            {fileData.map((list) => (
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
                // setVariables({ first: variables.first + groupTerm })
                countHandle()
              }}
              text="더보기"
              paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
              // widthRatio={LastWidth(1.7, 2.5, 40)}
            />
          </BoxBottomView>
        </Content>
      </Container>
    </>
  )
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    width: constants.width / 3.5,
  },
  inputAndroid: {
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    width: constants.width / 3.5,
  },
  seprator: {
    height: 10,
    width: 200,
    margin: 10,
  },
})
