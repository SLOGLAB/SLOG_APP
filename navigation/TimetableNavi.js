import React from "react"
import { createStackNavigator } from "react-navigation-stack"
import Timecontrol from "../screens/TimeTable/Timecontrol"
import TimetablecontrolBack from "../components/TimetablecontrolBack"
import BackButton from "../components/BackButton"

import { stackStyles } from "./config"
import AddSubject from "../screens/TimeTable/AddSubject"
import ChangeSubject from "../screens/TimeTable/ChangeSubject"
import DeleteSubject from "../screens/TimeTable/DeleteSubject"
import AddTimetable from "../screens/TimeTable/AddTimetable"
import BookmarkSubject from "../screens/TimeTable/BookmarkSubject"
// import TimetableWeek from "../screens/AWeekTime/TimetableWeek"
import ToDoButton from "../screens/TodoList/ToDoButton"
export default createStackNavigator({
  // TimetableWeek: {
  //   screen: TimetableWeek,
  //   navigationOptions: {
  //     title: "과목",
  //     headerLeft: <BackButton />,
  //     headerStyle: {
  //       ...stackStyles,
  //     },
  //     headerTintColor: "#000000",
  //   },
  // },
  Timecontrol: {
    screen: Timecontrol,
    navigationOptions: {
      title: "과목",
      headerLeft: <BackButton />,
      // headerRight: <ToDoButton />,
      headerStyle: {
        ...stackStyles,
      },
      headerTitleStyle: {
        fontFamily: "GmarketMedium",
      },
      headerTintColor: "#000000",
    },
  },
  AddSubject: {
    screen: AddSubject,
    navigationOptions: {
      title: "과목 추가",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTitleStyle: {
        fontFamily: "GmarketMedium",
      },
      headerTintColor: "#000000",
    },
  },
  ChangeSubject: {
    screen: ChangeSubject,
    navigationOptions: {
      title: "과목 수정",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTitleStyle: {
        fontFamily: "GmarketMedium",
      },
      headerTintColor: "#000000",
    },
  },
  DeleteSubject: {
    screen: DeleteSubject,
    navigationOptions: {
      title: "과목 삭제",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTitleStyle: {
        fontFamily: "GmarketMedium",
      },
      headerTintColor: "#000000",
    },
  },
  AddTimetable: {
    screen: AddTimetable,
    navigationOptions: {
      title: "스케줄 만들기",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTitleStyle: {
        fontFamily: "GmarketMedium",
      },
      headerTintColor: "#000000",
    },
  },
  BookmarkSubject: {
    screen: BookmarkSubject,
    navigationOptions: {
      title: "과목 북마크",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTitleStyle: {
        fontFamily: "GmarketMedium",
      },
      headerTintColor: "#000000",
    },
  },
})
