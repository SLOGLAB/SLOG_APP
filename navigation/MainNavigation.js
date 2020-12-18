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
import Timecontrol from "../screens/TimeTable/Timecontrol"
// import FollowSwiper from "../screens/Profile/Follow/FollowSwiper"
import Apps from "../Object/Apps"
import ExObject from "../Object/ExObject"

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    SwiperBase,
    MenuNavigation,
    TimetableNavi,
    PhotoNavigation,
    TodoListSwiper,
    Timecontrol,
    Apps,
    ExObject,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles,
      },
    },
    headerMode: "none",
  }
)

export default createAppContainer(MainNavigation)
