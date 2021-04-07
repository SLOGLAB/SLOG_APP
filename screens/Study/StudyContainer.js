import React, { useEffect, useState, useRef } from "react"
import { View, Dimensions, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native"
import styled from "styled-components"
import Constants from "expo-constants"
import constants from "../../constants"
import BackButton from "../../components/BackButton"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"

import StudyPoseContainer from "./StudyPoseContainer"
import StudyPoseLand from "../../Object/StudyPoseLand"
import StudySSd from "../../Object/StudySSd"
import StudySSdPose from "../../Object/StudySSdPose"
import Swiper from "react-native-swiper"

import StudyPresenter from "./StudyPresenter"
import { Container, Header, TabHeading, Tab, Tabs, Text } from "native-base"
import TodoListController from "../TodoList/TodoListController"
import TodoListEndController from "../TodoList/TodoListEndController"
import { withNavigationFocus } from "react-navigation"
import { useKeepAwake } from "expo-keep-awake"
import { ScrollView } from "react-native-gesture-handler"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

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

const SideView = styled.View`
  width: ${constants.width / 1};
  height: ${constants.height / 1};
  /* flex: 1; */
  /* align-items: flex-end;
  justify-content: flex-end; */
`

const SideView1 = styled.View`
  /* flex: ${(props) => props.bool}; */
  position: absolute;
  width: ${constants.width / 1};
  justify-content: center;
  height: ${(constants.height * 1) / 2.9};
  align-items: flex-end;
  background-color: rgba(233, 237, 244, 0);
  margin-top: ${constants.height / 1.65};
`
const SideViewLand = styled.View`
  width: ${constants.height / 1};
  height: ${constants.width / 1};
  align-items: flex-start;
  justify-content: flex-end;
`
const SideViewLand2 = styled.View`
  position: absolute;
  width: ${constants.height / 2};
  height: ${constants.width / 2};
  justify-content: center;
  align-items: flex-start;
  padding-left: 20;

  background-color: rgba(233, 237, 244, 0);
`
const SideView2 = styled.View`
  width: ${constants.width / 1};
  margin-top: 30;
`
const BodyView = styled.View`
  flex-direction: row;
  /* justify-content: center;
  align-items: cent
  er; */
  width: ${constants.height / 1};
  height: ${constants.width / 1};
  background-color: rgba(15, 76, 130, 1);
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

const StudyContainer = ({ navigation }) => {
  const Bright = navigation.getParam("Bright")

  const screenData = useScreenDimensions()
  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)

  let heigt = 812 / HEIGHT

  useKeepAwake() //화면 안꺼지게 expo
  ///
  const minValue_10 = (value) => value >= 10
  const refreshTerm = useInput(10, minValue_10)

  const todolistName = useInput("")
  const scheduleTitle = useInput("")
  const [studyBool, setStudyBool] = useState(false)
  const [androidCam, setandroidCam] = useState(true)
  const [personOnoff, setpersonOnoff] = useState(true)

  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())
  const [setting, setSetting] = useState(false)

  const oneDayHours_tmp = Array.from(Array(24).keys())
  const oneDayHours = oneDayHours_tmp.map(String)

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

  useEffect(() => {
    myInfoRefetch()
  }, [])
  // useEffect(() => {
  //   if (screenData.isLandscape) {
  //     console.log("hi")
  //   }
  // }, [screenData.isLandscape])
  return (
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
          {!screenData.isLandscape ? (
            <SafeAreaView>
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
                  Bright={Bright}
                  land={screenData.isLandscape}
                  setting={setting}
                  setSetting={setSetting}
                  androidCam={androidCam}
                  setandroidCam={setandroidCam}
                  personOnoff={personOnoff}
                  setpersonOnoff={setpersonOnoff}
                />
                <SideView1>
                  <StudyPresenter
                    myData={myInfoData.me}
                    loading={loading}
                    selectDate={selectDate}
                    nextDate={nextDate}
                    myInfoRefetch={myInfoRefetch}
                    land={screenData.isLandscape}
                    setting={setting}
                    setSetting={setSetting}
                    androidCam={androidCam}
                    setandroidCam={setandroidCam}
                    personOnoff={personOnoff}
                    setpersonOnoff={setpersonOnoff}
                  />
                </SideView1>
              </SideView>
            </SafeAreaView>
          ) : (
            <>
              {/* {Platform.OS == "ios" ? <SideView2 /> : null} */}
              <SideViewLand>
                <StudyPoseContainer
                  navigation={navigation}
                  myInfoData={myInfoData}
                  myInfoRefetch={myInfoRefetch}
                  deg={"270deg"}
                  // setbool={true}
                  loading={loading}
                  selectDate={selectDate}
                  nextDate={nextDate}
                  Bright={Bright}
                  land={screenData.isLandscape}
                  setting={setting}
                  setSetting={setSetting}
                  androidCam={androidCam}
                  setandroidCam={setandroidCam}
                  personOnoff={personOnoff}
                  setpersonOnoff={setpersonOnoff}
                />
                <SideViewLand2>
                  <StudyPresenter
                    myData={myInfoData.me}
                    loading={loading}
                    selectDate={selectDate}
                    nextDate={nextDate}
                    myInfoRefetch={myInfoRefetch}
                    land={screenData.isLandscape}
                    setting={setting}
                    setSetting={setSetting}
                    androidCam={androidCam}
                    setandroidCam={setandroidCam}
                    personOnoff={personOnoff}
                    setpersonOnoff={setpersonOnoff}
                  />
                </SideViewLand2>
              </SideViewLand>
            </>
          )}
        </>
      )}
    </>
  )
}

export default withNavigationFocus(StudyContainer)

{
  /* <SideView1> */
}
{
  /* <Container>
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
                  </Container> */
}
{
  /* </SideView1> */
}
