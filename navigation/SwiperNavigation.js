// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
// import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialTopTabNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import { createBottomTabNavigator } from "react-navigation-tabs"
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { stackStyles } from "./config";
import styles from "../styles";
import TodayController from "../screens/Stat/TodayController";
import WeekController from "../screens/Stat/WeekController";
import MonthController from "../screens/Stat/MonthController";

const StudyLOG = createMaterialTopTabNavigator(
  {
    TodayController: {
      screen: TodayController,
      navigationOptions: {
        tabBarLabel: "Today",
      },
    },
    Weeks: {
      screen: WeekController,
      navigationOptions: {
        tabBarLabel: "Weeks",
      },
    },

    Months: {
      screen: MonthController,
      navigationOptions: {
        tabBarLabel: "Months",
      },
    },
  },
  {
    tabBarPosition: "top",
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: "#2b80ff",
      },
      labelStyle: {
        color: "#2b80ff",
        fontWeight: "300",
      },
      style: {
        backgroundColor: "#FAFAFA",
      },
    },
  }
);

export default createStackNavigator(
  {
    Tabs: {
      screen: StudyLOG,
      navigationOptions: {
        title: "Study LOG",
        headerBackTitle: null,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles,
      },
      headerTintColor: "#0F4C82",
    },
  }
);
