// import { createAppContainer } from "react-navigation"
// import { createSharedElementStackNavigator } from "react-navigation-shared-element"
// // import {enableScreens} from 'react-native-screens';
// import MainScreen from "../screens/Profile/myPost.js/MainScreen"
// import DetailScreen from "../screens/Profile/myPost.js/DetailScreen"
// // import {springyFadeIn} from './transitions';

// enableScreens()

// // Instead of calling `createStackNavigator`, wrap it using `createSharedElementStackNavigator`
// const StackNavigator = createSharedElementStackNavigator(
//   {
//     Main: MainScreen,
//     Detail: DetailScreen,
//   },
//   {
//     // transitionConfig: () => springyFadeIn(),
//     initialRouteName: "List",
//   }
// )

// export default createAppContainer(StackNavigator)

import React from "react"
import { createStackNavigator } from "react-navigation-stack"
import Menu from "../screens/Menu/Menu"
import Menu2 from "../screens/Menu/Menu2"
import MainScreen from "../screens/Profile/myPost.js/MainScreen"
import DetailScreen from "../screens/Profile/myPost.js/DetailScreen"
import BackButton from "../components/BackButton"
import BackMenuButton from "../components/BackMenuButton"

import { stackStyles } from "./config"

export default createStackNavigator({
  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
      title: "설정",
      headerLeft: <BackButton />,
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#FFFFFF",
    },
  },
  DetailScreen: {
    screen: DetailScreen,
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
