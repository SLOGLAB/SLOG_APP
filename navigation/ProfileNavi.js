import React from "react"
import { createStackNavigator } from "react-navigation-stack"
import UserProfile from "../screens/Profile/UserProfile"
import BackButton from "../components/BackButton"
import QRcode from "../screens/Profile/QRcode"
import { createAppContainer } from "react-navigation"
import PhotoNavigation from "./PhotoNavigation"
import Profiledetail from "../screens/Profile/Profiledetail"
import Account from "../screens/Profile/Account"
import FollowSwiper from "../screens/Profile/Follow/FollowSwiper"
import { stackStyles } from "./config"
import DetailScreen from "../screens/Profile/myPost.js/DetailScreen"

export default createStackNavigator(
  {
    UserProfile,
    QRcode,
    Profiledetail,
    Account,
    PhotoNavigation,
    DetailScreen,
    FollowSwiper: {
      screen: FollowSwiper,
      navigationOptions: {
        title: "설정",
        headerTintColor: "#000000",
        headerStyle: {
          ...stackStyles,
        },
      },
    },
  },
  {
    headerMode: "none",
  }
)
