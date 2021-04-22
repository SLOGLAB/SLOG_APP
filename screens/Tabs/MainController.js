import React, { useEffect, useState, useRef } from "react"
import Main from "./Main"
import { ScrollView, RefreshControl } from "react-native"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
import { useQuery, useMutation } from "@apollo/react-hooks"

import { GO_WITH } from "../Tabs/QueryBox"
import { ME, EDIT_STUDYSET } from "./QueryBox"

export default ({ navigation }) => {
  const { loading, data: myInfoData, refetch: myInfoRefetch } = useQuery(ME)

  //현재 스케줄 있을 때만 시간기록 mutation
  const [editStudyPlaySetMutation] = useMutation(EDIT_STUDYSET, {
    refetchQueries: () => [{ query: ME }],
  })
  //
  const minValue_10 = (value) => value >= 10

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
          />
        </>
      )}
    </ScrollView>
  )
}
