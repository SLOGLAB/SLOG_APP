import React from "react"
import { Platform, View, Image, Text } from "react-native"
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
import ProfileButton from "../screens/Profile/ProfileButton"
import ToDoButton from "../screens/TodoList/ToDoButton"
import MyGroupContainer from "../screens/Group/MyGoup/MyGroupContainer"
import SearchGroupButton from "../screens/Group/SearchGroup/SearchGroupButton"
import BookButton from "../components/BookButton"
import MyStudyContainer from "../screens/MyStudy/MyStudyContainer"
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
        headerLeft: <ProfileButton />,
        headerRight: <ToDoButton />,
        title: "DEEPTIME",
        headerTitleStyle: {
          fontFamily: "GmarketBold",
        },
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home"} />
            <Text style={{ fontSize: 10 }}>홈</Text>
          </>
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
        // headerLeft: <BookButton />,
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-pie" : "md-pie"} />
            <Text style={{ fontSize: 10 }}>통계</Text>
          </>
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
    MyStudyContainer: {
      screen: stackFactory(MyStudyContainer, {
        headerRight: <BookButton />,
        title: "진도 관리",
        headerTitleStyle: {
          fontFamily: "GmarketBold",
        },
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-book" : "md-book"} />
            <Text style={{ fontSize: 10 }}>진도 관리</Text>
          </>
        ),
      },
    },
    TimetableWeek: {
      screen: TimetableWeek,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon
              focused={focused}
              name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
            />
            <Text style={{ fontSize: 10 }}>스케줄</Text>
          </>
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
    MyGroupContainer: {
      screen: stackFactory(MyGroupContainer, {
        // headerLeft: "DEEPTIME",
        headerRight: <SearchGroupButton />,
        title: "나의 그룹",
        headerTitleStyle: {
          fontFamily: "GmarketBold",
        },
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <>
            <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-people" : "md-people"} />
            <Text style={{ fontSize: 10 }}>그룹</Text>
          </>
        ),
      },
    },

    // ProfileNavi: {
    //   screen: ProfileNavi,

    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <>
    //         <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person"} />
    //         <Text style={{ fontSize: 10 }}>프로필</Text>
    //       </>
    //     ),
    //   },
    // },
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
//     // headerRight: <BookButton />,
//     title: "계정",
//     // headerLeft: <Menu2 />
//   }),
//   navigationOptions: {
//     tabBarIcon: ({ focused }) => (
//       <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person"} />
//     ),
//   },
// },
