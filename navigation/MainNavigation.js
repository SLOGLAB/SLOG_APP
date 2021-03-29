import { createStackNavigator } from "react-navigation-stack"
import { createAppContainer } from "react-navigation"
import TabNavigation from "./TabNavigation"
import MenuNavigation from "./MenuNavigation"
import TimetableNavi from "./TimetableNavi"
// import ProfileNavi from "./ProfileNavi"
import { stackStyles } from "./config"
import SwiperBase from "../screens/Stat/SwiperBase"
import TodoListSwiper from "../screens/TodoList/TodoListSwiper"
import StudyContainer from "../screens/Study/StudyContainer"
import Timecontrol from "../screens/TimeTable/Timecontrol"
// import FollowSwiper from "../screens/Profile/Follow/FollowSwiper"
import PhotoNavigation from "./PhotoNavigation"
import Userdetail from "../screens/UserDetail/UserDetail"
import OneGroupContainer from "../screens/Group/OneGroup/OneGroupContainer"
import EditGroup from "../screens/Group/Edit/EditGroup"
import CreateGroupContainer from "../screens/Group/CreateGroup/CreateGroupContainer"
import SearchGroupContainer from "../screens/Group/SearchGroup/SearchGroupContainer"
import UserDetailSwiper from "../screens/UserDetail/UserSwiper/UserDetailSwiper"
import UserSchedule from "../screens/UserDetail/UserSwiper/UserSchedule"
import AddTimetable from "../screens/TimeTable/AddTimetable"
import SelectGroupPhoto from "../screens/Group/SelectGroupPhoto"
const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    SwiperBase,
    MenuNavigation,
    TimetableNavi,
    TodoListSwiper,
    StudyContainer,
    PhotoNavigation,
    Userdetail,
    Timecontrol,
    OneGroupContainer,
    EditGroup,
    CreateGroupContainer,
    SearchGroupContainer,
    UserDetailSwiper,
    UserSchedule,
    AddTimetable,
    SelectGroupPhoto,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles,
      },
      gesturesEnabled: false,
    },
    headerMode: "none",
  }
)

export default createAppContainer(MainNavigation)
