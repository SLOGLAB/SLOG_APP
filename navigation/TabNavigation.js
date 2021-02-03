import React from "react"
import { Platform, View, Image } from "react-native"
// import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from "react-navigation-tabs"

import NavIcon from "../components/NavIcon"
import { stackStyles } from "./config"
import MainController from "../screens/Tabs/MainController"
import FeedPhotoNavigation from "../navigation/FeedPhotoNavigation"
import TimetableWeek from "../screens/AWeekTime/TimetableWeek"
import ProfileNavi from "../navigation/ProfileNavi"
import SwiperBase from "../screens/Stat/SwiperBase"
// import UserProfile from "../screens/Profile/UserProfile"
import ToDoButton from "../screens/TodoList/ToDoButton"
import StudyButton from "../screens/Study/StudyButton"
import FeedContainer from "../screens/Feed/FeedContainer"
import D_day from "../screens/D_day"
import TodoListSwiper from "../screens/TodoList/TodoListSwiper"
import ObjectButton from "../Object/ObjectButton"
import NavGreenIcon from "../components/NavGreenIcon"
import MenuButton from "../components/MenuButton"
import StudyContainer from "../screens/Study/StudyContainer"

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
        // headerLeft: <StudyButton />,
        headerRight: <ToDoButton />,
        title: "DEEPTIME",
        headerTitleStyle: {
          fontFamily: "GmarketBold",
        },
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
        headerTitleStyle: {
          fontFamily: "GmarketBold",
        },
        // headerLeft: <Iam />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-pie" : "md-pie"} />
        ),
      },
    },
    // StudyContainer: {
    //   // screen: stackFactory(StudyContainer, {
    //   //   title: "Feed",
    //   // }),
    //   screen: StudyContainer,
    //   navigationOptions: ({ navigation }) => ({
    //     tabBarOnPress: () => {
    //       navigation.navigate("StudyContainer")
    //     },
    //     tabBarVisible: false,
    //     tabBarIcon: ({ tintColor }) => (
    //       <View
    //         style={{
    //           position: "absolute",
    //           bottom: 20, // space from bottombar
    //           height: 58,
    //           width: 58,
    //           borderRadius: 58,
    //           backgroundColor: "#5a95ff",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <Image
    //           source={require("../assets/Group79.svg")}
    //           style={{
    //             width: 40,
    //             height: 40,
    //             tintColor: "#f1f6f9",
    //             alignContent: "center",
    //           }}
    //         />
    //       </View>
    //     ),
    //   }),
    // },
    TimetableWeek: {
      screen: TimetableWeek,
      // screen: stackFactory(TimetableWeek, {
      //   title: "Study Log",
      //   // headerLeft: <Iam />
      // }),

      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
          />
        ),
      },
    },

    // FeedPhotoNavigation: {
    //   screen: stackFactory(FeedPhotoNavigation, {
    //     title: "Feed",
    //   }),
    //   // screen: FeedPhotoNavigation,
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-list" : "md-list"} />
    //     ),
    //   },
    // },

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
