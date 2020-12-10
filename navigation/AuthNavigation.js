// import { createStackNavigator, createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import Signup from "../screens/Auth/Signup";
import Confirm from "../screens/Auth/Confirm";
import Login from "../screens/Auth/Login";
import AuthHome from "../screens/Auth/AuthHome";
import FindEmail from "../screens/Auth/FindEmail";
import FindPassword from "../screens/Auth/FindPassword";

const AuthNavigation = createStackNavigator(
  {
    AuthHome,
    Signup,
    Login,
    Confirm,
    FindEmail,
    FindPassword,
  },
  {
    headerMode: "none",
  }
);

export default createAppContainer(AuthNavigation);
