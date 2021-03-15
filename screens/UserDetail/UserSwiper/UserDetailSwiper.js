import React, { useState, useEffect, useRef } from "react"
import { Platform, TouchableOpacity } from "react-native"
import {
  Container,
  TabHeading,
  Text,
  Tab,
  Tabs,
  ScrollView,
  RefreshControl,
  Header,
} from "native-base"
import Today from "../../Stat/Today"
import Weeks from "../../Stat/Weeks"
import Months from "../../Stat/Months"
import { StatusBar } from "react-native"
import Icon from "../../../components/Icon"
import { color } from "react-native-reanimated"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import styled from "styled-components"

const GET_USER = gql`
  query seeUser($username: String!) {
    seeUser(username: $username) {
      id
      avatar
      username
      bio
      fullName
      isSelf
      email
      studyPurpose
      studyGroup
      studyGroup2
      studyGroup3
      pubOfFeed
      pubOfStatistic
      pubOfSchedule
      postsCount
      followingCount
      followersCount
      isFollowing
      isFollowed
      times {
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
        timelapseRecord
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
        createdAt
      }
      following {
        id
        avatar
        email
        username
        isFollowing
        isSelf
      }
      followers {
        id
        avatar
        email
        username
        isFollowing
        isSelf
        followDates {
          id
          followId
          createdAt
        }
      }
      posts {
        id
        files {
          id
          url
          key
        }
        likeCount
        commentCount
      }
    }
  }
`
const TopView = styled.View`
  width: 100%;
  height: 10%;
  background-color: rgba(233, 237, 244, 1);
  flex-direction: row;
`
const FlexLeft = styled.View`
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  margin-top: 25;
  padding-left: 15;
`
const FlexCenter = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
export default ({ navigation }) => {
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

  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: { username: navigation.getParam("username") },
  })
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
    <Container>
      {Platform.OS == "ios" ? (
        <StatusBar barStyle="dark-content" />
      ) : (
        <StatusBar barStyle="light-content" />
      )}
      <TopView>
        <FlexLeft>
          <TouchableOpacity onPress={() => navigation.navigate("Userdetail")}>
            <Icon
              name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              color={"#000000"}
              size={40}
            />
          </TouchableOpacity>
        </FlexLeft>
        <FlexCenter></FlexCenter>
        <FlexLeft></FlexLeft>
      </TopView>
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
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <Today
            myData={data.seeUser}
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
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <Weeks
            myData={data.seeUser}
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
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
          activeTabStyle={
            Platform.OS === "ios" ? { backgroundColor: "#ffffff" } : { backgroundColor: "#0f4c82" }
          }
        >
          <Months
            myData={data.seeUser}
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
  )
}
