import React, { useEffect, useState } from "react"
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import styled from "styled-components"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import LastWidth from "../../components/LastWidth"
import Icon from "../../components/Icon"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
const MainView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  /* height: 100%;
  width: 100%; */
`
const AddToDoView = styled.View`
  height: 7%;
  flex-direction: row;
  margin-left: 5;
  margin-right: 5;
  margin-top: 10;
  margin-bottom: 10;
  /* align-items: center; */
  /* justify-content: center; */
`
const AddToDoPickerView = styled.View`
  height: 100%;
  width: 25%;
`
const AddToDoNameView = styled.View`
  height: 100%;
  width: 60%;
  padding-left: 5;
`
const AddToDoButtonView = styled.View`
  height: 100%;
  width: 15%;
  margin-right: 0;
`
const ListView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 3;
  border-width: 2;
  border-color: rgba(196, 196, 196, 1);
  margin-left: 5;
  margin-right: 7;
  height: 85%;
`
const Widhi100 = styled.View`
  width: 100%;
`

const ListsView = styled.View``
//
//
const IndiviList = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 40;
  margin-top: 4;
  margin-left: 4;
  margin-right: 4;
  border: 0.5px;
  border-color: rgba(196, 196, 196, 1);

  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const TaskView = styled.View`
  width: 20%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 3;
`
const TaskNameView = styled.View`
  width: 65%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const TaskFlagView = styled.View`
  width: 15%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ColorBox = styled.View`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  background-color: ${(props) => props.bgColor};
  margin-right: 5px;
  border-radius: ${(props) => props.radius};
`
const TaskName_todo = styled.Text`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-right: 5px;
  margin-left: 3px;
  font-size: 10;
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`

const TodoNameDiv = styled.Text`
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 220px;
  font-size: 13;
  padding: 0 10px;
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const FlexView = styled.View`
  flex: 1;
`
const FlexView1 = styled.View`
  flex: 0.5;
`
export default ({
  refreshing,
  onRefresh,
  subjectData,
  todolistData,
  todolistRefetch,
  addTodolistMutation,
  deleteTodolistMutation,
  finishTodolistMutation,
  todolistName,
}) => {
  const [subjectId, setSubjectId] = useState("")
  const todolistClear = () => {
    todolistName.setValue("")
    // SubjectList.setOption("")
  }

  const SubjectList_tmp = subjectData.mySubject.map((file) => {
    if (file.bookMark) {
      return {
        label: file.name,
        value: file.id,
      }
    }
  })
  const SubjectLists = SubjectList_tmp.filter(function (el) {
    return el != undefined
  })

  //

  //   todolistData 오름차순 정렬
  todolistData.myTodolist.sort(function (a, b) {
    return a.subject.name < b.subject.name
      ? -1
      : a.subject.name > b.subject.name
      ? 1
      : // : a.name < b.name
        // ? -1
        // : a.name > b.name
        // ? 1
        0
  })
  // todolistData Task 없음이 위로오게
  todolistData.myTodolist.sort(function (a, b) {
    const word = "TASK 없음"
    return a.subject.name === word && b.subject.name !== word
      ? -1
      : a.subject.name !== word && b.subject.name === word
      ? 1
      : 0
  })

  //todolist 완료된거랑 아닌거 구분
  let todolistData_new = []
  let todolistData_finish = []
  todolistData.myTodolist.map((todolist) => {
    if (todolist.finish) {
      todolistData_finish.push(todolist)
    } else {
      todolistData_new.push(todolist)
    }
  })

  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text)

  const onTodolistAdd = async () => {
    if (todolistName.value === "") {
      Alert.alert("내용을 입력하세요.")
      return
    }
    try {
      const {
        data: { addTodolist },
      } = await addTodolistMutation({
        variables: {
          name: todolistName.value,
          subjectId: subjectId,
        },
      })
      if (!addTodolist) {
        Alert.alert("To Do List를 추가할 수 없습니다.")
      } else {
        await todolistRefetch()
        await todolistClear()
        // Alert.alert("새로운 To DO List가 추가되었습니다.")
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }
  } //추가
  const onTodolistDelete = async (todolistId) => {
    try {
      //   Alert.alert("To Do List를 제거 중...")
      const {
        data: { deleteTodolist },
      } = await deleteTodolistMutation({
        variables: {
          todolistId,
        },
      })
      if (!deleteTodolist) {
        Alert.alert("To Do List를 제거할 수 없습니다.")
      } else {
        await todolistRefetch()
        // Alert.alert("To DO List가 제거되었습니다.")
        return true
      }
    } catch (e) {
      console.log(e)
    }
  } // X
  const onTodolistFinish = async (todolistId) => {
    try {
      //   Alert.alert("To Do List를 완료 중...")
      const {
        data: { finishTodolist },
      } = await finishTodolistMutation({
        variables: {
          todolistId,
        },
      })
      if (!finishTodolist) {
        Alert.alert("To Do List를 완료할 수 없습니다.")
      } else {
        await todolistRefetch()
        // Alert.alert("To DO List가 완료되었습니다.")
        return true
      }
    } catch (e) {
      console.log(e)
    }
  } //깃발
  useEffect(() => {}, [])
  return (
    <MainView>
      <AddToDoView>
        <AddToDoPickerView>
          {Platform.OS === "ios" ? (
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setSubjectId(value)
                }
              }}
              items={SubjectLists}
              placeholder={{
                label: "TASK선택...",
                value: null,
                color: "red",
              }}
              value={subjectId}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 12,
                  right: 5,
                },
                placeholder: {
                  color: "grey",
                  fontSize: 10,
                  fontWeight: "normal",
                },
              }}
              Icon={() => {
                return (
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                    size={10}
                    color="gray"
                  />
                )
              }}
            />
          ) : (
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setSubjectId(value)
                }
              }}
              items={SubjectLists}
              placeholder={{
                label: "TASK선택...",
                value: null,
                color: "red",
              }}
              value={subjectId}
              style={{
                ...pickerSelectStyles,
                placeholder: {
                  color: "grey",
                  fontSize: 10,
                  fontWeight: "normal",
                },
              }}
            />
          )}
        </AddToDoPickerView>
        <AddToDoNameView>
          <AuthInput
            paddingArray={[1, 1, 1, 1]}
            {...todolistName}
            numberOfLines={1}
            // onChange={() => {}}
            placeholder="내용(예: 1단원 암기)"
            //   keyboardType="email-address"
            returnKeyType="next"
            autoCorrect={false}
            widthRatio={1.0}
          />
          {/* <AuthInput
            paddingArray={[5, 0, 5, 0]}
            numberOfLines={2}
            {...todolistName}
            placeholder="내용(예: 1단원 암기)"
            returnKeyType="done"
            autoCorrect={false}
          /> */}
        </AddToDoNameView>
        <AddToDoButtonView>
          <AuthButton
            color="white"
            onPress={() => {
              onTodolistAdd()
              onRefresh()
            }}
            text="입력"
            paddingArray={Platform.OS === "ios" ? [4, 4, 4, 4] : [7, 7, 7, 7]}
            widthRatio={LastWidth(1.7, 2.5, 18)}
          />
        </AddToDoButtonView>
      </AddToDoView>
      <ListView>
        <Widhi100>
          <ScrollView
            style={{ backgroundColor: "#ffffff" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                style={{ backgroundColor: "#ffffff" }}
              />
            }
          >
            {todolistData_new.map((list) => (
              <IndiviList key={list.id}>
                <TaskView>
                  <ColorBox size={"10px"} radius={"16px"} bgColor={list.subject.bgColor} />
                  <TaskName_todo> {trimText(list.subject.name, 10)}</TaskName_todo>
                </TaskView>
                <TaskNameView>
                  <TodoNameDiv>{trimText(list.name, 15)}</TodoNameDiv>
                </TaskNameView>
                <TaskFlagView>
                  <FlexView>
                    <TouchableOpacity
                      onPress={() => {
                        onTodolistFinish(list.id)
                      }}
                    >
                      <Icon
                        name={Platform.OS === "ios" ? "ios-flag" : "md-flag"}
                        size={20}
                        color={"#CA5040"}
                      />
                    </TouchableOpacity>
                  </FlexView>
                  <FlexView1 />

                  <FlexView>
                    <TouchableOpacity
                      onPress={() => {
                        onTodolistDelete(list.id)
                      }}
                    >
                      <Icon
                        name={
                          Platform.OS === "ios"
                            ? "ios-close-circle-outline"
                            : "md-close-circle-outline"
                        }
                        size={20}
                        color={"black"}
                      />
                    </TouchableOpacity>
                  </FlexView>
                </TaskFlagView>
              </IndiviList>
            ))}
          </ScrollView>
        </Widhi100>
      </ListView>
    </MainView>
  )
}
const styles = StyleSheet.create({
  label: {
    margin: 8,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
  },
  inputAndroid: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
  },
})
