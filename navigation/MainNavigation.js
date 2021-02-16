// import { createStackNavigator, createAppContainer } from "react-navigation"

import { createStackNavigator } from "react-navigation-stack"
import { createAppContainer } from "react-navigation"
// import React from "react"

import TabNavigation from "./TabNavigation"
import MenuNavigation from "./MenuNavigation"
import TimetableNavi from "./TimetableNavi"
// import ProfileNavi from "./ProfileNavi"
import { stackStyles } from "./config"
import SwiperBase from "../screens/Stat/SwiperBase"
import TodoListSwiper from "../screens/TodoList/TodoListSwiper"
import StudyContainer from "../screens/Study/StudyContainer"
import Timecontrol from "../screens/TimeTable/Timecontrol"
// import FollowSwiper from "../screens/Profile/Follow/FollowSwiper"
import PhotoNavigation from "./PhotoNavigation"

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    SwiperBase,
    MenuNavigation,
    TimetableNavi,
    TodoListSwiper,
    StudyContainer,
    PhotoNavigation,

    Timecontrol,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles,
      },
      gesturesEnabled: false,
    },
    headerMode: "none",
  }
)

export default createAppContainer(MainNavigation)
