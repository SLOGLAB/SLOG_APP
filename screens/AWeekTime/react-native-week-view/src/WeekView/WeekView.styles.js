import { StyleSheet, Dimensions } from "react-native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  headerContainer: {
    flexDirection: "row",
  },
  header: {
    flex: 1,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH - 60,
  },
})

export default styles
