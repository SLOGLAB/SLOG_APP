import React, { useState, useEffect, useRef } from "react"
import { Platform } from "react-native"
import { Container, TabHeading, Text, Tab, Tabs, ScrollView, RefreshControl } from "native-base"
import Today from "./Today"
import Weeks from "./Weeks"
import Months from "./Months"
import { StatusBar } from "react-native"
import { color } from "react-native-reanimated"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
export const ME = gql`
  {
    me {
      id
      studyPurpose
      times {
        id
        existTime
        time_24
        createdAt
      }
      schedules {
        id
        start
        end
        isAllDay
        isPrivate
        title
        location
        totalTime
        state
        subject {
          id
          name
          bgColor
        }
      }
    }
  }
`
export default () => {
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay

  ///
  const StaTabContents = ["Today", "Week", "Month"]

  const [refreshing, setRefreshing] = useState(false)
  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())

  const [selectPercent, setSelectPercent] = useState(false)
  const [selectPercent2, setSelectPercent2] = useState(false)

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

  const { loading, data, refetch } = useQuery(ME)

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await refetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }
  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <Container>
          {Platform.OS == "ios" ? (
            <StatusBar barStyle="dark-content" />
          ) : (
            <StatusBar barStyle="light-content" />
          )}
          {/* <Header hasTabs /> */}
          <Tabs>
            <Tab
              heading={
                <TabHeading>
                  <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Today</Text>
                </TabHeading>
              }
              textStyle={{ color: "#ffffff" }}
              // heading="Today"
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
              <Today
                myData={data.me}
                onRefresh={onRefresh}
                selectDate={selectDate}
                nextDate={nextDate}
                setSelectDate={setSelectDate}
                oneDayHours={oneDayHours}
                loading={loading}
                targetToday={targetToday}
                //
                selectPercent={selectPercent}
                setSelectPercent={setSelectPercent}
                selectPercent2={selectPercent2}
                setSelectPercent2={setSelectPercent2}
                refreshing={refreshing}
              />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Week</Text>
                </TabHeading>
              }
              // heading="Week"
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
              <Weeks
                myData={data.me}
                onRefresh={onRefresh}
                selectDate={selectDate}
                nextDate={nextDate}
                setSelectDate={setSelectDate}
                oneDayHours={oneDayHours}
                loading={loading}
                targetToday={targetToday}
                //
                selectPercent={selectPercent}
                setSelectPercent={setSelectPercent}
                selectPercent2={selectPercent2}
                setSelectPercent2={setSelectPercent2}
                refreshing={refreshing}
              />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Text style={{ fontSize: 15, fontFamily: "GmarketMedium" }}>Month</Text>
                </TabHeading>
              }
              // heading="Month"
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
              <Months
                myData={data.me}
                onRefresh={onRefresh}
                selectDate={selectDate}
                nextDate={nextDate}
                setSelectDate={setSelectDate}
                oneDayHours={oneDayHours}
                loading={loading}
                targetToday={targetToday}
                //
                selectPercent={selectPercent}
                setSelectPercent={setSelectPercent}
                selectPercent2={selectPercent2}
                setSelectPercent2={setSelectPercent2}
                refreshing={refreshing}
              />
            </Tab>
          </Tabs>
        </Container>
      )}
    </>
  )
}
