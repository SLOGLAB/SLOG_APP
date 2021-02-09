import React, { useEffect, useState, useRef } from "react"
import { View, Dimensions, StyleSheet, Platform, StatusBar } from "react-native"
import styled from "styled-components"
import Constants from "expo-constants"
import constants from "../../constants"
import BackButton from "../../components/BackButton"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
import StudyPoseLand from "../../Object/StudyPoseLand"
import StudySSd from "../../Object/StudySSd"
import StudySSdPose from "../../Object/StudySSdPose"
import StudyPoseContainer from "./StudyPoseContainer"
import Swiper from "react-native-swiper"

import StudyPresenter from "./StudyPresenter"
import { Container, Header, TabHeading, Tab, Tabs, Text } from "native-base"
import TodoListController from "../TodoList/TodoListController"
import TodoListEndController from "../TodoList/TodoListEndController"
import { withNavigationFocus } from "react-navigation"
import { useKeepAwake } from "expo-keep-awake"

export const ME = gql`
  {
    me {
      id
      username
      fullName
      avatar
      email
      existToggle
      studyPurpose
      todayTime {
        attendanceStatus
        absenceReason
      }
      times {
        id
        existTime
        time_24
        createdAt
      }
      schedules {
        id
        isAllDay
        isPrivate
        title
        location
        state
        start
        end
        totalTime
        subject {
          id
          name
          bgColor
        }
      }
      studyDefaultSet {
        nonScheduleRecord
        autoRefresh
        autoRefreshTerm
        startScheduleTerm
        cutExtenTerm
        scheduleStart
        scheduleEnd
        dDayOn
        dDateName
        dDate
      }
      followDates {
        id
        followId
        goWith
        createdAt
      }
      withFollowing {
        id
        avatar
        username
        existToggle
        todayTime {
          existTime
        }
      }
      following {
        id
        avatar
        email
        username
      }
    }
  }
`
const ContainerLandscape = styled.View`
  /* background-color: rgba(0, 0, 0, 1); */
  /* align-items: center;
  justify-content: center; */
  /* height: ${(constants.height / 13) * 12}; */
`

const RowView = styled.View`
  /* flex-direction: row; */
  height: ${(constants.height / 13) * 13};
  /* background-color: rgba(65, 129, 247, 1); */
`
const SideView = styled.View`
  width: ${constants.width / 1};
  flex: 1;
`
const SideView1 = styled.View`
  flex: 1.3;
  width: ${constants.width / 1};
  /* background-color: rgba(65, 129, 247, 1); */
`
const SideView11 = styled.View`
  flex: 1;
  width: ${constants.width / 1};
  justify-content: center;
  align-items: center;
`
const SideView2 = styled.View`
  width: ${constants.width / 1};
  flex: 0.1;
`
const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("screen"))

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.screen)
    }

    Dimensions.addEventListener("change", onChange)

    return () => Dimensions.removeEventListener("change", onChange)
  })

  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
  }
}

// export default
const StudyContainer = ({ navigation }) => {
  const screenData = useScreenDimensions()
  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay
  useKeepAwake()
  ///
  const minValue_10 = (value) => value >= 10
  const refreshTerm = useInput(10, minValue_10)

  const todolistName = useInput("")
  const scheduleTitle = useInput("")
  const [studyBool, setStudyBool] = useState(false)

  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())

  const oneDayHours_tmp = Array.from(Array(24).keys())
  const oneDayHours = oneDayHours_tmp.map(String)

  // const bool = navigation.getParam("bool")

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      nextDate.setDate(new Date().getDate() + 1)
      return
    }
    nextDate.setTime(selectDate.getTime())
    nextDate.setDate(nextDate.getDate() + 1)
  }, [selectDate])
  // const [newTodoView, setNewTodoView] = useState(false)

  useEffect(() => {
    myInfoRefetch()
  }, [])

  return (
    // <View style={[styles.container, screenData.isLandscape && styles.containerLandscape]}>
    //   <View style={[styles.box, { width: screenData.width / 2 }]} />
    // </View>
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {Platform.OS == "ios" ? (
            <StatusBar barStyle="dark-content" />
          ) : (
            <StatusBar barStyle="light-content" />
          )}
          <>
            <RowView>
              {Platform.OS == "ios" ? <SideView2 /> : null}
              <SideView>
                <StudyPoseContainer
                  navigation={navigation}
                  myInfoData={myInfoData}
                  myInfoRefetch={myInfoRefetch}
                  deg={"270deg"}
                  // setbool={true}
                  loading={loading}
                  selectDate={selectDate}
                  nextDate={nextDate}
                />
                {/* <StudyPoseLand
                  navigation={navigation}
                  myInfoData={myInfoData}
                  myInfoRefetch={myInfoRefetch}
                  deg={"270deg"}
                  // setbool={true}
                  loading={loading}
                  selectDate={selectDate}
                  nextDate={nextDate}
                /> */}
                {/* <StudySSd
                  navigation={navigation}
                  myInfoData={myInfoData}
                  myInfoRefetch={myInfoRefetch}
                  deg={"270deg"}
                  // setbool={true}
                  loading={loading}
                  selectDate={selectDate}
                  nextDate={nextDate}
                /> */}
                {/* <StudySSdPose
                  navigation={navigation}
                  myInfoData={myInfoData}
                  myInfoRefetch={myInfoRefetch}
                  deg={"270deg"}
                  setbool={newTodoView}
                  loading={loading}
                  selectDate={selectDate}
                  nextDate={nextDate}
                /> */}
              </SideView>
              <SideView1>
                <Container>
                  <Tabs>
                    <Tab
                      heading={
                        <TabHeading>
                          <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>
                            Deep Time
                          </Text>
                        </TabHeading>
                      }
                      tabStyle={
                        Platform.OS === "ios"
                          ? { backgroundColor: "#ffffff" }
                          : { backgroundColor: "#0f4c82" }
                      }
                      activeTabStyle={
                        Platform.OS === "ios"
                          ? { backgroundColor: "#ffffff" }
                          : { backgroundColor: "#0f4c82" }
                      }
                    >
                      <StudyPresenter
                        myData={myInfoData.me}
                        loading={loading}
                        selectDate={selectDate}
                        nextDate={nextDate}
                        myInfoRefetch={myInfoRefetch}
                      />
                    </Tab>
                    <Tab
                      heading={
                        <TabHeading>
                          <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>
                            Todo List
                          </Text>
                        </TabHeading>
                      }
                      tabStyle={
                        Platform.OS === "ios"
                          ? { backgroundColor: "#ffffff" }
                          : { backgroundColor: "#0f4c82" }
                      }
                      activeTabStyle={
                        Platform.OS === "ios"
                          ? { backgroundColor: "#ffffff" }
                          : { backgroundColor: "#0f4c82" }
                      }
                    >
                      <TodoListController todoArray={[9, 0, 5, 0]} />
                    </Tab>
                  </Tabs>
                </Container>
              </SideView1>
            </RowView>
          </>
          {/* {screenData.isLandscape ? (
          ) : (
            <ContainerLandscape>
              <TopView />
              <BodyView>
                <SideView>
                  <Container>
                    <StudyPoseLand
                      navigation={navigation}
                      myInfoData={myInfoData}
                      myInfoRefetch={myInfoRefetch}
                      deg={"0deg"}
                      setbool={screenData.isLandscape}
                    />
                  </Container>
                </SideView>
                <SideView>
                  <StudyPresenter
                    myData={myInfoData.me}
                    loading={loading}
                    selectDate={selectDate}
                    nextDate={nextDate}
                    myInfoRefetch={myInfoRefetch}
                  />
                </SideView>
              </BodyView>
            </ContainerLandscape>
          )} */}

          {/* <ContainerLandscape>
            <TopView />
            <RowView>
              <SideView>
                <Container>
                  <Apps
                    navigation={navigation}
                    myInfoData={myInfoData}
                    myInfoRefetch={myInfoRefetch}
                  />
                </Container>
              </SideView>
              <SideView>
                <StudyPresenter
                  myData={myInfoData.me}
                  loading={loading}
                  selectDate={selectDate}
                  nextDate={nextDate}
                  myInfoRefetch={myInfoRefetch}
                />
              </SideView>
            </RowView>
          </ContainerLandscape> */}
        </>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  slide1: {
    // flex: 1,
  },
})

export default withNavigationFocus(StudyContainer)
