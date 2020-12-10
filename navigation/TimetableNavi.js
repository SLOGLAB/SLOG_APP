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
  //     title: "TASK",
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
      title: "TASK",
      headerLeft: <BackButton />,
      headerRight: <ToDoButton />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#000000",
    },
  },
  AddSubject: {
    screen: AddSubject,
    navigationOptions: {
      title: "설정",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#000000",
    },
  },
  ChangeSubject: {
    screen: ChangeSubject,
    navigationOptions: {
      title: "설정",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#000000",
    },
  },
  DeleteSubject: {
    screen: DeleteSubject,
    navigationOptions: {
      title: "설정",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#000000",
    },
  },
  AddTimetable: {
    screen: AddTimetable,
    navigationOptions: {
      title: "설정",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#000000",
    },
  },
  BookmarkSubject: {
    screen: BookmarkSubject,
    navigationOptions: {
      title: "설정",
      // headerLeft: <TimetablecontrolBack />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#000000",
    },
  },
})
