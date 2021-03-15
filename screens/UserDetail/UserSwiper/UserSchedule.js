import React, { useEffect } from "react"
import { Alert, Dimensions } from "react-native"
import styled from "styled-components"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import UserScheduleP from "./UserScheduleP"
import Loader from "../../../components/Loader"

export const USER_SCHEDULE = gql`
  query userSchedule($userId: String!) {
    userSchedule(userId: $userId) {
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
  }
`

export const USER_SUBJECT = gql`
  query userSubject($userId: String!) {
    userSubject(userId: $userId) {
      id
      name
      color
      bgColor
      dragBgColor
      borderColor
      bookMark
    }
  }
`
const LoaderWrapper = styled.View`
  justify-content: center;
  align-items: center;
`
const ScheView = styled.View`
  height: 100%;
`
const ScheView2 = styled.View`
  height: 10%;
`
export default UserSchedule = ({ navigation }) => {
  var timetableRef

  const { loading, data: scheduledata, refetch } = useQuery(USER_SCHEDULE, {
    variables: { userId: navigation.getParam("userId") },
  })
  const { loading: Subjectloading, data: subjectdata, refetch: Subjectrefetch } = useQuery(
    USER_SUBJECT,
    {
      variables: { userId: navigation.getParam("userId") },
    }
  )

  const onRefresh = async () => {
    try {
      await refetch()
      await Subjectrefetch()
    } catch (e) {
      console.log(e)
    }
  }
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay

  useEffect(() => {
    onRefresh()
  }, [])
  if (loading || Subjectloading) {
    return (
      <LoaderWrapper style={{ minHeight: Math.round(Dimensions.get("window").height) }}>
        <Loader />
      </LoaderWrapper>
    )
  } else {
    return (
      //   <></>
      <UserScheduleP
        scheduledata={scheduledata}
        timetableRef={timetableRef}
        onRefresh={onRefresh}
        loading={loading}
        targetToday={targetToday}
        Subjectdata={subjectdata}
        navigation={navigation}
        username={navigation.getParam("username")}
      />
    )
  }
}
