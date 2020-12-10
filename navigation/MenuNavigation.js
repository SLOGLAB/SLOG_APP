// import { createStackNavigator } from "react-navigation"
// import { goBack } from "react"
import React from "react"
import { createStackNavigator } from "react-navigation-stack"
import Menu from "../screens/Menu/Menu"
import Menu2 from "../screens/Menu/Menu2"

import BackButton from "../components/BackButton"
import BackMenuButton from "../components/BackMenuButton"

import { stackStyles } from "./config"

export default createStackNavigator({
  Menu: {
    screen: Menu,
    navigationOptions: {
      title: "설정",
      headerLeft: <BackButton />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#FFFFFF",
    },
  },
  Menu2: {
    screen: Menu2,
    navigationOptions: {
      title: "목표 시간 설정",
      headerLeft: <BackMenuButton />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#FFFFFF",
    },
  },
})

// ios-arrow-round-back
// md-arrow-round-back
{
  /* <NavIcon name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"} /> */
}
