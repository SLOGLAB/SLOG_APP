import React from "react"
import styled from "styled-components"
import { TouchableWithoutFeedback, Keyboard } from "react-native"

import AButton from "../../components/AButton"
import AuthButton from "../../components/AuthButton"

const MenuView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const View = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 15;
`
const SubView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 15;
  flex-direction: row;
`

export default Timecontrol = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MenuView>
        <View>
          <AuthButton
            color="white"
            bgColor={"#0f4c82"}
            onPress={() => navigation.navigate("AddTimetable")}
            text="스케줄 만들기"
          />
        </View>
        <View />
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("BookmarkSubject")}
            text="과목 북마크"
            color={"black"}
          />
        </SubView>
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("AddSubject")}
            text="과목 추가"
            color={"black"}
          />
        </SubView>
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("ChangeSubject")}
            text="과목 수정"
            color={"black"}
          />
        </SubView>
        <SubView>
          <AButton
            bgColor={"rgb(230, 230, 230)"}
            onPress={() => navigation.navigate("DeleteSubject")}
            text="과목 제거"
            color={"black"}
          />
        </SubView>
      </MenuView>
    </TouchableWithoutFeedback>
  )
}
