import React from "react"
import { Platform } from "react-native"
import styled from "styled-components"
import { withNavigation } from "react-navigation"
import NavBlackIcon from "./NavBlackIcon"
import AuthButton from "./AuthButton"
const Container = styled.TouchableOpacity`
  padding-right: 15px;
`
const RowView = styled.View`
  flex-direction: row;
`
export default withNavigation(({ navigation }) => (
  <RowView>
    <Container onPress={() => navigation.navigate("BookAnalysisContainer")}>
      <AuthButton
        text={"+책 추가"}
        color="white"
        bgColor={"#0f4c82"}
        onPress={() => {
          navigation.navigate("BookAnalysisContainer")
        }}
        widthRatio={7}
        marginArray={[0, 0, 0, 0]}
        paddingArray={[6, 0, 6, 0]}
      />
    </Container>
    <Container onPress={() => navigation.navigate("TimetableNavi")}>
      <AuthButton
        text={"과목설정"}
        color="white"
        bgColor={"#0f4c82"}
        onPress={() => {
          navigation.navigate("TimetableNavi")
        }}
        widthRatio={7}
        marginArray={[0, 0, 0, 0]}
        paddingArray={[6, 0, 6, 0]}
      />
    </Container>
  </RowView>
))
