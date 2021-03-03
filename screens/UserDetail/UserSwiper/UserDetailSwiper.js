import React, { useEffect, useState, useRef } from "react"
import { View, Dimensions, StyleSheet, Platform, StatusBar } from "react-native"
import styled from "styled-components"
import constants from "../../constants"
import BackButton from "../../components/BackButton"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"

import { Container, Header, TabHeading, Tab, Tabs, Text } from "native-base"

import { withNavigationFocus } from "react-navigation"
import { useKeepAwake } from "expo-keep-awake"
import UserSchedule from "./UserSchedule"
import UserStatistics from "./UserStatistics"
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

const StudyContainer = ({ navigation }) => {
  const Bright = navigation.getParam("Bright")

  const screenData = useScreenDimensions()
  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay
  useKeepAwake() //화면 안꺼지게 expo
  ///
  const minValue_10 = (value) => value >= 10

  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())

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
            <SideView1>
              <Container>
                <Tabs>
                  <Tab
                    heading={
                      <TabHeading>
                        <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Deep Time</Text>
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
                    <UserSchedule
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
                        <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Todo List</Text>
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
                    <UserStatistics />
                  </Tab>
                </Tabs>
              </Container>
            </SideView1>
          </>
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
