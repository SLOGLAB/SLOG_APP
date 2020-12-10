import React, { useEffect, useState, useRef } from "react"
import Main from "./Main"
import { ScrollView, RefreshControl, Alert, TouchableOpacity, Platform } from "react-native"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import { MY_TODOLIST, MY_SUBJECT, GO_WITH, EDIT_STUDYSET } from "../Tabs/QueryBox"

export const ME = gql`
  {
    me {
      id
      username
      fullName
      avatar
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

export default () => {
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay

  ///
  const minValue_10 = (value) => value >= 10
  const refreshTerm = useInput(10, minValue_10)

  const todolistName = useInput("")
  const scheduleTitle = useInput("")
  const [studyBool, setStudyBool] = useState(false)
  const [newTodoView, setNewTodoView] = useState(false)

  const [refreshing, setRefreshing] = useState(false)
  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())

  const [selectPercent, setSelectPercent] = useState(true)

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

  const { data: todolistData, loading: todolistLoading, refetch: todolistRefetch } = useQuery(
    MY_TODOLIST
  )
  const { data: subjectData, loading: subjectLoading, refetch: subjectRefetch } = useQuery(
    MY_SUBJECT
  )
  const [goWithMutation] = useMutation(GO_WITH, {
    refetchQueries: () => [{ query: ME }],
  })

  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await myInfoRefetch()
      await todolistRefetch()
      await subjectRefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }
  useEffect(() => {
    onRefresh()
    // console.log(myInfoData.me.studyDefaultSet)
  }, [])
  return (
    <ScrollView
      style={{ backgroundColor: "#FFFFFF" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: "#FAFAFA" }}
        />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <Main
          myData={myInfoData.me}
          selectDate={selectDate}
          nextDate={nextDate}
          loading={loading}
          targetToday={targetToday}
          onRefresh={onRefresh}
          setSelectDate={setSelectDate}
          oneDayHours={oneDayHours}
          //
          selectPercent={selectPercent}
          setSelectPercent={setSelectPercent}
          refreshTerm={refreshTerm}
          studyBool={studyBool}
          setStudyBool={setStudyBool}
          todolistRefetch={todolistRefetch}
          subjectData={subjectData.mySubject}
          todolistName={todolistName}
          newTodoView={newTodoView}
          setNewTodoView={setNewTodoView}
          scheduleTitle={scheduleTitle}
          goWithMutation={goWithMutation}
          myInfoRefetch={myInfoRefetch}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
        />
      )}
    </ScrollView>
  )
}

// const todayd = new Date().getDate() //Current Date
// const todaydate = todayd < 10 ? `0${todayd}` : todayd
// const months = new Date().getMonth() + 1 //Current Month
// const todaymonth = months < 10 ? `0${months}` : months
// const todayyear = new Date().getFullYear() //Current Year
// const today = todayyear + "." + todaymonth + "." + todaydate
// useEffect(() => {
//   refetch()
// }, [NowTime])
