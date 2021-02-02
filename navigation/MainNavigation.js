// import { createStackNavigator, createAppContainer } from "react-navigation"

import { createStackNavigator } from "react-navigation-stack"
import { createAppContainer } from "react-navigation"
// import React from "react"

import TabNavigation from "./TabNavigation"
import MenuNavigation from "./MenuNavigation"
import TimetableNavi from "./TimetableNavi"
// import ProfileNavi from "./ProfileNavi"
import { stackStyles } from "./config"
import PhotoNavigation from "./PhotoNavigation"
import SwiperBase from "../screens/Stat/SwiperBase"
import TodoListSwiper from "../screens/TodoList/TodoListSwiper"
import StudyContainer from "../screens/Study/StudyContainer"
import Timecontrol from "../screens/TimeTable/Timecontrol"
// import FollowSwiper from "../screens/Profile/Follow/FollowSwiper"
import Apps from "../Object/Apps"

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    SwiperBase,
    MenuNavigation,
    TimetableNavi,
    PhotoNavigation,
    TodoListSwiper,
    StudyContainer,
    Timecontrol,
    Apps,
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
