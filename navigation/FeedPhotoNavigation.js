// import { createMaterialTopTabNavigator, createStackNavigator } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation"
import React from "react"
import ProfileBack from "../components/ProfileBack"

import SelectPhotoFeed from "../screens/Feed/SelectPhotoFeed"
import FeedTakePhoto from "../screens/Feed/FeedTakePhoto"
import UploadFeed from "../screens/Feed/UploadFeed"
import { stackStyles } from "./config"
import styles from "../styles"
import FeedContainer from "../screens/Feed/FeedContainer"

const FeedTabs = createBottomTabNavigator(
  {
    Select: {
      screen: SelectPhotoFeed,
      navigationOptions: {
        tabBarLabel: "선택",
      },
    },
    Take: {
      screen: FeedTakePhoto,
      navigationOptions: {
        tabBarLabel: "촬영",
      },
    },
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: styles.blackColor,
        marginBottom: 20,
      },
      labelStyle: {
        color: styles.blackColor,
        fontWeight: "600",
      },
      style: {
        paddingBottom: 20,
        ...stackStyles,
      },
    },
  }
)

export default createStackNavigator(
  {
    FeedContainer,
    FeedTabs: {
      screen: FeedTabs,
      navigationOptions: {
        title: "사진 선택",
        headerLeft: <ProfileBack />,

        headerBackTitle: null,
      },
    },
    UploadFeed: {
      screen: UploadFeed,
      navigationOptions: {
        title: "Upload",
      },
    },
  },
  {
    // defaultNavigationOptions: {
    //   headerStyle: {
    //     ...stackStyles,
    //   },
    //   headerTintColor: styles.blackColor,
    // },
    headerMode: "none",
  }
)
