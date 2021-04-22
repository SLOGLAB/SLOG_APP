import React from "react"
import { createStackNavigator } from "react-navigation-stack"
import UserProfile from "../screens/Profile/UserProfile"
import QRcode from "../screens/Profile/QRcode"
import { createAppContainer } from "react-navigation"
import PhotoNavigation from "./PhotoNavigation"
import Profiledetail from "../screens/Profile/Profiledetail"
import EditAccount from "../screens/Profile/EditAccount"
import FollowSwiper from "../screens/Profile/Follow/FollowSwiper"
import { stackStyles } from "./config"
import MyPostlScreen from "../screens/Profile/myPost.js/MyPostlScreen"

export default createStackNavigator(
  {
    UserProfile,
    QRcode,
    Profiledetail,
    EditAccount,
    MyPostlScreen: {
      screen: MyPostlScreen,
      navigationOptions: {
        title: "d",
      },
    },
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
