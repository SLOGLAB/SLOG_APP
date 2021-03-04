import React, { useEffect, useState, useRef } from "react"
import GroupMonths from "./GroupMonths"
import { ScrollView, RefreshControl } from "react-native"
import { useQuery } from "@apollo/react-hooks"
import styled from "styled-components"
import { gql } from "apollo-boost"
import Loader from "../../../components/Loader"

export default ({ groupData, groupRefetch, loading, navigation, myData }) => {
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay

  ///
  const [selectPercent, setSelectPercent] = useState(false)
  const [selectPercent2, setSelectPercent2] = useState(false)
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

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await groupRefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }
  return (
    // <TodayView />
    <ScrollView
      style={{ backgroundColor: "#E9EDF4" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: "#E9EDF4" }}
        />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <GroupMonths
          myData={myData}
          groupData={groupData}
          onRefresh={onRefresh}
          selectDate={selectDate}
          nextDate={nextDate}
          setSelectDate={setSelectDate}
          oneDayHours={oneDayHours}
          loading={loading}
          targetToday={targetToday}
          selectPercent={selectPercent}
          setSelectPercent={setSelectPercent}
          selectPercent2={selectPercent2}
          setSelectPercent2={setSelectPercent2}
          navigation={navigation}
        />
      )}
    </ScrollView>
  )
}
