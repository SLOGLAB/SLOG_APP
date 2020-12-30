import React from "react"
import { Platform } from "react-native"
// import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation-tabs"

import NavGreenIcon from "../components/NavGreenIcon"

import NavIcon from "../components/NavIcon"
import MenuButton from "../components/MenuButton"
import { stackStyles } from "./config"
import MainController from "../screens/Tabs/MainController"
import D_day from "../screens/D_day"
import FeedPhotoNavigation from "../navigation/FeedPhotoNavigation"
import FeedContainer from "../screens/Feed/FeedContainer"
import TimetableWeek from "../screens/AWeekTime/TimetableWeek"
import ProfileNavi from "../navigation/ProfileNavi"
import SwiperBase from "../screens/Stat/SwiperBase"
// import UserProfile from "../screens/Profile/UserProfile"
import ToDoButton from "../screens/TodoList/ToDoButton"
import TodoListSwiper from "../screens/TodoList/TodoListSwiper"
import StudyButton from "../screens/Study/StudyButton"
import ObjectButton from "../Object/ObjectButton"
const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig,
        },
      },
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerTintColor: "#224C7E",
        headerStyle: { ...stackStyles },
      },
    }
  )
export default createBottomTabNavigator(
  {
    MainController: {
      screen: stackFactory(MainController, {
        headerLeft: <StudyButton />,
        headerRight: <ToDoButton />,
        title: "DEEP TIME",
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home"} />
        ),
      },
    },
    // TodoListSwiper: {
    //   screen: TodoListSwiper,
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon
    //         focused={focused}
    //         name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}
    //       />
    //     ),
    //   },
    // },
    SwiperBase: {
      screen: stackFactory(SwiperBase, {
        title: "Study Log",
        // headerLeft: <Iam />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-pie" : "md-pie"} />
        ),
      },
    },
    TimetableWeek: {
      screen: TimetableWeek,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
          />
        ),
      },
    },
    FeedPhotoNavigation: {
      screen: stackFactory(FeedPhotoNavigation, {
        title: "Feed",
      }),
      // screen: FeedPhotoNavigation,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-list" : "md-list"} />
        ),
      },
    },

    ProfileNavi: {
      screen: ProfileNavi,
      // screen: stackFactory(ProfileNavi, {
      //   headerRight: <Timetablecontrol />,
      //   title: "프로필",
      //   // headerLeft: <Menu2 />,
      // }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person"} />
        ),
      },
    },
  },

  {
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#FAFAFA",
      },
    },
  }
)

// Profile: {
//   screen: stackFactory(Profile, {
//     // headerRight: <MenuButton />,
//     title: "계정",
//     // headerLeft: <Menu2 />
//   }),
//   navigationOptions: {
//     tabBarIcon: ({ focused }) => (
//       <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person"} />
//     ),
//   },
// },
