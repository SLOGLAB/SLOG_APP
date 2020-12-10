// import { createMaterialTopTabNavigator, createStackNavigator } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation"
import React from "react"
import ProfileBack from "../components/ProfileBack"

import SelectPhoto from "../screens/Photo/SelectPhoto"
import TakePhoto from "../screens/Photo/TakePhoto"
import UploadPhoto from "../screens/Photo/UploadPhoto"
import { stackStyles } from "./config"
import styles from "../styles"

const PhotoTabs = createBottomTabNavigator(
  {
    Select: {
      screen: SelectPhoto,
      navigationOptions: {
        tabBarLabel: "선택",
      },
    },
    Take: {
      screen: TakePhoto,
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
    Tabs: {
      screen: PhotoTabs,
      navigationOptions: {
        title: "사진 선택",
        headerLeft: <ProfileBack />,

        headerBackTitle: null,
      },
    },
    Upload: {
      screen: UploadPhoto,
      navigationOptions: {
        title: "Upload",
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: styles.blackColor,
    },
  }
)
