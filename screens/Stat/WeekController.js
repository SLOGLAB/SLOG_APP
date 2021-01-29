import React, { useEffect, useState, useRef } from "react"
import { ScrollView, RefreshControl } from "react-native"

import Weeks from "./Weeks"
import { useQuery } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import { gql } from "apollo-boost"

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
        <Weeks
          myData={data.me}
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
        />
      )}
    </ScrollView>
  )
}
// targetTime1={targetTime1}
// targetTime2={targetTime2}
// targetTime3={targetTime3}
// targetTime4={targetTime4}
// targetTime5={targetTime5}
// targetTime6={targetTime6}
// targetTime7={targetTime7}

// console.log(existData)
// const timeNumber = async () => {
//   for (j = 0; j < 7; j++) {
//     weekTimeArray.push(
//       existData.findIndex((i) => moment(i.createdAt).format("YYYY-MM-DD") === thisWeek[j])
//     )
//   }
//   if (weekTimeArray[0] === -1) {
//     setExistTime1(0)
//   } else {
//     setExistTime1(existData[weekTimeArray[0]].existTime)
//   }
//   if (weekTimeArray[1] === -1) {
//     setExistTime2(0)
//   } else {
//     setExistTime2(existData[weekTimeArray[1]].existTime)
//   }
//   if (weekTimeArray[2] === -1) {
//     setExistTime3(0)
//   } else {
//     setExistTime3(existData[weekTimeArray[2]].existTime)
//   }
//   if (weekTimeArray[3] === -1) {
//     setExistTime4(0)
//   } else {
//     setExistTime4(existData[weekTimeArray[3]].existTime)
//   }
//   if (weekTimeArray[4] === -1) {
//     setExistTime5(0)
//   } else {
//     setExistTime5(existData[weekTimeArray[4]].existTime)
//   }
//   if (weekTimeArray[5] === -1) {
//     setExistTime6(0)
//   } else {
//     setExistTime6(existData[weekTimeArray[5]].existTime)
//   }
//   if (weekTimeArray[6] === -1) {
//     setExistTime7(0)
//   } else {
//     setExistTime7(existData[weekTimeArray[6]].existTime)
//   }
// }

// const setTargetTimeSun = async () => {
//   targetArraySun.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[0])
//   )
//   targetArrayMon.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[1])
//   )
//   targetArrayTue.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[2])
//   )
//   targetArrayWed.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[3])
//   )
//   targetArrayThu.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[4])
//   )
//   targetArrayFri.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[5])
//   )
//   targetArraySat.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[6])
//   )
// }
// const sumExistTimeSun = () => {
//   if (targetArraySun[0][0] !== undefined) {
//     for (i = 0; i < targetArraySun[0].length; i++) {
//       targetHourSun.push(
//         (moment(targetArraySun[0][i].end).format("HH") -
//           moment(targetArraySun[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArraySun[0][i].end).format("mm") -
//             moment(targetArraySun[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime1(SumArray(targetHourSun))
//     }
//   } else {
//     setTargetTime1(0)
//   }
//   if (targetArrayMon[0][0] !== undefined) {
//     for (i = 0; i < targetArrayMon[0].length; i++) {
//       targetHourMon.push(
//         (moment(targetArrayMon[0][i].end).format("HH") -
//           moment(targetArrayMon[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayMon[0][i].end).format("mm") -
//             moment(targetArrayMon[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime2(SumArray(targetHourMon))
//     }
//   } else {
//     setTargetTime2(0)
//   }
//   if (targetArrayTue[0][0] !== undefined) {
//     for (i = 0; i < targetArrayTue[0].length; i++) {
//       targetHourTue.push(
//         (moment(targetArrayTue[0][i].end).format("HH") -
//           moment(targetArrayTue[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayTue[0][i].end).format("mm") -
//             moment(targetArrayTue[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime3(SumArray(targetHourTue))
//     }
//   } else {
//     setTargetTime3(0)
//   }

//   if (targetArrayWed[0][0] !== undefined) {
//     for (i = 0; i < targetArrayWed[0].length; i++) {
//       targetHourWed.push(
//         (moment(targetArrayWed[0][i].end).format("HH") -
//           moment(targetArrayWed[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayWed[0][i].end).format("mm") -
//             moment(targetArrayWed[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime4(SumArray(targetHourWed))
//     }
//   } else {
//     setTargetTime4(0)
//   }
//   if (targetArrayThu[0][0] !== undefined) {
//     for (i = 0; i < targetArrayThu[0].length; i++) {
//       targetHourThu.push(
//         (moment(targetArrayThu[0][i].end).format("HH") -
//           moment(targetArrayThu[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayThu[0][i].end).format("mm") -
//             moment(targetArrayThu[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime5(SumArray(targetHourThu))
//     }
//   } else {
//     setTargetTime5(0)
//   }
//   if (targetArrayFri[0][0] !== undefined) {
//     for (i = 0; i < targetArrayFri[0].length; i++) {
//       targetHourFri.push(
//         (moment(targetArrayFri[0][i].end).format("HH") -
//           moment(targetArrayFri[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayFri[0][i].end).format("mm") -
//             moment(targetArrayFri[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime6(SumArray(targetHourFri))
//     }
//   } else {
//     setTargetTime6(0)
//   }
//   if (targetArraySat[0][0] !== undefined) {
//     for (i = 0; i < targetArraySat[0].length; i++) {
//       targetHourSat.push(
//         (moment(targetArraySat[0][i].end).format("HH") -
//           moment(targetArraySat[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArraySat[0][i].end).format("mm") -
//             moment(targetArraySat[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime7(SumArray(targetHourSat))
//     }
//   } else {
//     setTargetTime7(0)
//   }
// }
