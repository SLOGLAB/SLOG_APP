import React, { useEffect } from "react"
import { Alert, Dimensions } from "react-native"
import styled from "styled-components"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import TimeWeek from "./TimeWeek"
import Loader from "../../components/Loader"

export const SCHEDULE_USER = gql`
  {
    me {
      id
      studyPurpose
      schedules {
        id
        start
        end
        totalTime
        state
        subjectId
        subjectName
        location
        title
        isPrivate
        isAllDay
      }
    }
    mySubject {
      id
      name
      color
      bgColor
      bookMark
    }
  }
`

const LoaderWrapper = styled.View`
  justify-content: center;
  align-items: center;
`

export default TimetableWeek = () => {
  var timetableRef

  const { loading, data: scheduledata, refetch } = useQuery(SCHEDULE_USER, {
    // pollInterval: 3000,
  })

  const onRefresh = async () => {
    try {
      await refetch()
    } catch (e) {
      console.log(e)
    }
  }

  if (loading) {
    return (
      <LoaderWrapper style={{ minHeight: Math.round(Dimensions.get("window").height) }}>
        <Loader />
      </LoaderWrapper>
    )
  } else {
    return (
      <TimeWeek
        scheduledata={scheduledata}
        timetableRef={timetableRef}
        onRefresh={onRefresh}
        loading={loading}
        SCHEDULE_USER={SCHEDULE_USER}
      />
    )
  }
}

// const [saveScheduleMutation] = useMutation(SAVE_SCHEDULE)

// const subjectdata = scheduledata.mySubject
// const events_data = scheduledata.me.schedules.map((List) => {
//   // const addColor = addColor(List.bgColor)
//   return {
//     sub: List.id,
//     title: List.subjectName,
//     location: List.title,
//     subname: List.location,
//     startTime: new Date(List.start),
//     endTime: new Date(List.end),
//     color: "#7BA9EA",
//     // extra_descriptions: [List.location],
//   }
// })

// const settingEvent = () => {
//   setevents_data(
//     scheduledata.me.schedules.map((List) => {
//       return {
//         id: List.id,
//         description: List.subjectName,
//         location: List.location,
//         startDate: new Date(List.start),
//         endDate: new Date(List.end),
//         color: "#7BA9EA",
//         totalTime: List.totalTime,
//         subjectId: List.subjectId,
//       }
//     })
//   )
// }

// import React, { Component } from "react"
// import { WebView } from "react-native-webview"
// import styled from "styled-components"
// const View = styled.View`
//   flex: 1;
// `
// class Timetable extends Component {
//   render() {
//     return (
//       <View>
//         <WebView source={{ uri: "https://slog-iam.netlify.com/#/" }} style={{ marginTop: 20 }} />
//       </View>
//     )
//   }
// }
// export default Timetable

// import React from "react"
// import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Alert } from "react-native"
// import moment from "moment"

// import { Header } from "react-native/Libraries/NewAppScreen"

// import WeekView from "react-native-week-view"

// const Timetable = ({ data }) => {
//   const selectedDate = new Date()
//   const generateDates = (hours, minutes) => {
//     const date = new Date()
//     date.setHours(date.getHours() + hours)
//     if (minutes != null) {
//       date.setMinutes(minutes)
//     }
//     return date
//   }
//   const events = data.scheduleOfClass.map((List) => {
//     var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
//     const startday = days[new Date(List.start).getDay()]
//     const endday = days[new Date(List.end).getDay()]

//     const starthour = new Date(List.start).getHours()
//     const startmin = new Date(List.start).getMinutes()
//     const endhour = new Date(List.end).getHours()
//     const endmin = new Date(List.end).getMinutes()

//     const timeStart = moment(List.start).format("HH")
//     const timeStart2 = moment(List.start).format("mm")
//     const timeEnd = moment(List.end).format("HH")
//     const timeEnd2 = moment(List.end).format("mm")
//     // "YYYY-MM-DD HH:mm"
//     return {
//       id: List,
//       description: "Event",
//       startDate: new Date(List.start),
//       endDate: new Date(List.end),
//       color: "blue",
//     }
//   })
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={styles.container}>
//         <WeekView
//           events={events}
//           selectedDate={this.selectedDate}
//           numberOfDays={3}
//           onEventPress={(event) => Alert.alert("eventId:" + event.id)}
//           headerStyle={styles.headerStyle}
//           headerTextColor="#fff"
//           formatDateHeader="MMM D"
//         />
//       </SafeAreaView>
//     </>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF",
//     paddingTop: 22,
//   },
//   headerStyle: {
//     backgroundColor: "#4286f4",
//   },
// })

// export default Timetable

// const events_data = [
//   {
//     title: "Math",
//     startTime: genTimeBlock("MON", 9),
//     endTime: genTimeBlock("MON", 10, 50),
//     location: "Classroom 403",
//     extra_descriptions: ["Kim", "Lee"],
//   },
//   {
//     title: "Math",
//     startTime: genTimeBlock("WED", 9),
//     endTime: genTimeBlock("WED", 10, 50),
//     location: "Classroom 403",
//     extra_descriptions: ["Kim", "Lee"],
//   },
//   {
//     title: "Physics",
//     startTime: genTimeBlock("MON", 11),
//     endTime: genTimeBlock("MON", 11, 50),
//     location: "Lab 404",
//     extra_descriptions: ["Einstein"],
//   },
//   {
//     title: "Physics",
//     startTime: genTimeBlock("WED", 11),
//     endTime: genTimeBlock("WED", 11, 50),
//     location: "Lab 404",
//     extra_descriptions: ["Einstein"],
//   },
//   {
//     title: "Mandarin",
//     startTime: genTimeBlock("TUE", 9),
//     endTime: genTimeBlock("TUE", 10, 50),
//     location: "Language Center",
//     extra_descriptions: ["Chen"],
//   },
//   {
//     title: "Japanese",
//     startTime: genTimeBlock("FRI", 9),
//     endTime: genTimeBlock("FRI", 10, 50),
//     location: "Language Center",
//     extra_descriptions: ["Nakamura"],
//   },
//   {
//     title: "Club Activity",
//     startTime: genTimeBlock("THU", 9),
//     endTime: genTimeBlock("THU", 10, 50),
//     location: "Activity Center",
//   },
//   {
//     title: "Club Activity",
//     startTime: genTimeBlock("FRI", 13, 30),
//     endTime: genTimeBlock("FRI", 14, 50),
//     location: "Activity Center",
//   },
// ]
