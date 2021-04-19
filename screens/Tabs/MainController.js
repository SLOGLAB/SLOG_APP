import React, { useEffect, useState, useRef } from "react"
import Main from "./Main"
import {
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import { GO_WITH } from "../Tabs/QueryBox"

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
export const EDIT_STUDYSET = gql`
  mutation editStudySet(
    $autoDarkMode: Boolean
    $darkModeMin: Int
    $timelapseRecord: Boolean
    $nonScheduleRecord: Boolean
    $autoRefresh: Boolean
    $autoRefreshTerm: Int
    $startScheduleTerm: Int
    $cutExtenTerm: Int
    $scheduleStart: Int
    $scheduleEnd: Int
    $dDayOn: Boolean
    $dDateName: String
    $dDate: String
  ) {
    editStudySet(
      autoDarkMode: $autoDarkMode
      darkModeMin: $darkModeMin
      timelapseRecord: $timelapseRecord
      nonScheduleRecord: $nonScheduleRecord
      autoRefresh: $autoRefresh
      autoRefreshTerm: $autoRefreshTerm
      startScheduleTerm: $startScheduleTerm
      cutExtenTerm: $cutExtenTerm
      scheduleStart: $scheduleStart
      scheduleEnd: $scheduleEnd
      dDayOn: $dDayOn
      dDateName: $dDateName
      dDate: $dDate
    )
  }
`
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

export default ({ navigation }) => {
  const { loading, error, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)

  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay

  //현재 스케줄 있을 때만 시간기록 mutation
  const [editStudyPlaySetMutation] = useMutation(EDIT_STUDYSET, {
    refetchQueries: () => [{ query: ME }],
  })
  //
  const minValue_10 = (value) => value >= 10
  const refreshTerm = useInput(10, minValue_10)

  const todolistName = useInput("")
  const scheduleTitle = useInput("")
  const [studyBool, setStudyBool] = useState(false)
  const [newTodoView, setNewTodoView] = useState(false)

  const [refreshing, setRefreshing] = useState(false)
  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())

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

  const [goWithMutation] = useMutation(GO_WITH, {
    refetchQueries: () => [{ query: ME }],
  })

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await myInfoRefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    onRefresh()
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
        <>
          <Main
            myData={myInfoData.me}
            selectDate={selectDate}
            nextDate={nextDate}
            loading={loading}
            onRefresh={onRefresh}
            goWithMutation={goWithMutation}
            myInfoRefetch={myInfoRefetch}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            navigation={navigation}
            editStudyPlaySetMutation={editStudyPlaySetMutation}
            // targetToday={targetToday}
            // setSelectDate={setSelectDate}
            // oneDayHours={oneDayHours}
            //
            // selectPercent={selectPercent}
            // setSelectPercent={setSelectPercent}
            // refreshTerm={refreshTerm}
            // studyBool={studyBool}
            // setStudyBool={setStudyBool}
            // todolistRefetch={todolistRefetch}
            // subjectData={subjectData.mySubject}
            // todolistName={todolistName}
            // newTodoView={newTodoView}
            // setNewTodoView={setNewTodoView}
            // scheduleTitle={scheduleTitle}
          />
        </>
      )}
    </ScrollView>
  )
}
