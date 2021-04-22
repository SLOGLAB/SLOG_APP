import React, { useEffect, useState, useRef } from "react"
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Button,
} from "react-native"
import styled from "styled-components"
import RNPickerSelect from "react-native-picker-select"
import { Ionicons } from "@expo/vector-icons"
import AuthButton from "../../components/AuthButton"
import useInput from "../../hooks/useInput"
import AuthInput from "../../components/AuthInput"
import LastWidth from "../../components/LastWidth"
import Icon from "../../components/Icon"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import Animated from "react-native-reanimated"
import BottomSheet from "reanimated-bottom-sheet"
import useSelect from "../../hooks/useSelect"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
const MainView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  /* height: 100%;
  width: 100%; */
`
const AddToDoView = styled.View`
  height: 10%;
  flex-direction: row;
  margin-left: 5;
  margin-right: 5;
  align-items: center;
  justify-content: center;
`
const AddToDoPickerView = styled.View`
  /* height: 100%; */
  width: 25%;
`
const AddToDoNameView = styled.View`
  /* height: 100%; */
  width: 60%;
  padding-left: 6;
`
const AddToDoButtonView = styled.View`
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
  height: 83%;
`
const Widhi100 = styled.View`
  width: 100%;
`

const ListsView = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20;
`
const ListsTopView = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
  padding-right: 20;
  margin-bottom: 10;
`
//
//
const IndiviList = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 40;
  margin-top: 10;
  margin-left: 4;
  margin-right: 4;
  border: 0.5px;
  border-color: rgba(196, 196, 196, 1);

  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const TaskView = styled.View`
  width: 30%;
  height: 100%;
  border-right-width: 0.5px;
  border-color: rgba(196, 196, 196, 1);
  padding-left: 3;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const TaskNameView = styled.TouchableOpacity`
  width: 70%;
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
  font-size: 13;
  /* color: ${(props) => props.color}; */
  color: rgba(0, 0, 0, 1);

  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`

const TodoNameDiv = styled.Text`
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 220px;
  font-size: 13;
  padding: 0 10px;
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const TodoText = styled.Text`
  font-size: 13;
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const FlexView = styled.View`
  justify-content: flex-start;
  align-items: center;
  flex: 1;
`
const FlexView1 = styled.View`
  justify-content: flex-start;
  align-items: center;
  flex: 0.5;
`
export default ({
  refreshing,
  onRefresh,
  subjectData,
  subjectRefetch,
  todolistData,
  todolistRefetch,
  addTodolistMutation,
  deleteTodolistMutation,
  finishTodolistMutation,
  editTodolistMutation,
  todolistName,
  subjectList,
  todoArray,
}) => {
  let todolistData_new = []
  let todolistData_finish = []
  todolistData.myTodolist.map((todolist) => {
    if (todolist.finish) {
      todolistData_finish.push(todolist)
    } else {
      todolistData_new.push(todolist)
    }
  })
  const [subjectId, setSubjectId] = useState("")
  const [checkTouch, setcheckTouch] = useState(false)
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

  //todolist 완료된거랑 아닌거 구분

  //
  //   todolistData 오름차순 정렬
  todolistData.myTodolist.sort(function (a, b) {
    return a.subject.name < b.subject.name ? -1 : a.subject.name > b.subject.name ? 1 : 0
  })
  // todolistData Task 없음이 위로오게
  todolistData.myTodolist.sort(function (a, b) {
    const word = "과목 없음"
    return a.subject.name === word && b.subject.name !== word
      ? -1
      : a.subject.name !== word && b.subject.name === word
      ? 1
      : 0
  })
  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text)

  const onTodolistAdd = async () => {
    if (subjectId === "") {
      Alert.alert("과목을 선택하세요.")
      return
    } else if (todolistName.value === "") {
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
    } finally {
    }
  } //깃발
  const onTodolistEdit = async () => {
    if (subject === "") {
      Alert.alert("과목을 선택하세요.")
      return
    } else if (titleInput.value === "") {
      Alert.alert("내용을 입력하세요.")
      return
    }

    try {
      const {
        data: { editTodolist },
      } = await editTodolistMutation({
        variables: {
          todolistId: todoid,
          subjectId: subject,
          name: titleInput.value,
        },
      })
      if (!editTodolist) {
        Alert.alert("To Do를 수정할 수 없습니다.")
      } else {
        await todolistRefetch()
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }

  const sheetRef = React.useRef(null)
  const [subject, setSubject] = useState("")
  const [todoid, settodoid] = useState("")
  const titleInput = useInput("")

  const renderContent = () => (
    <View
      style={{
        backgroundColor: "#f7f5eee8",
        paddingLeft: 10,
        height: "100%",
        // justifyContent: "center",
        // alignItems: "center",
        width: "100%",
      }}
    >
      <ListsTopView>
        <TouchableOpacity
          onPress={() => {
            setSubject("")
            sheetRef.current.snapTo(1)
          }}
        >
          <Icon
            name={Platform.OS === "ios" ? "ios-close-circle-outline" : "md-close-circle-outline"}
            size={25}
            color={"black"}
          />
        </TouchableOpacity>
      </ListsTopView>
      <ListsView>
        <FlexView1>
          <RNPickerSelect
            onValueChange={(value) => {
              if (value !== null) {
                setSubject(value)
              }
            }}
            items={SubjectLists}
            placeholder={{
              label: "과목선택...",
              value: null,
              color: "red",
            }}
            value={subject}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 12,
                right: 5,
              },
              placeholder: {
                color: "grey",
                fontSize: 13,
                fontWeight: "normal",
              },
            }}
            Icon={() => {
              return (
                <Ionicons
                  name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                  size={15}
                  color="gray"
                />
              )
            }}
          />
        </FlexView1>

        <FlexView>
          <AuthInput
            {...titleInput}
            placeholder={"(필수) 제목"}
            keyboardType="default"
            returnKeyType="done"
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
            // marginArray={[0, 0, 20, 0]}
          />
        </FlexView>
      </ListsView>
      <>
        <FlexView1>
          <AuthButton
            color="white"
            onPress={() => {
              onTodolistEdit()
              sheetRef.current.snapTo(1)
            }}
            text="수정하기"
            widthRatio={LastWidth(1, 2, 18)}
          />
          {/* <TouchableOpacity
            onPress={() => {
              onTodolistEdit()
              sheetRef.current.snapTo(1)
            }}
          >
            <TodoText>수정하기</TodoText>
          </TouchableOpacity> */}
        </FlexView1>
        <FlexView1>
          <AuthButton
            color="white"
            onPress={() => {
              onTodolistDelete(todoid)
              sheetRef.current.snapTo(1)
            }}
            text="삭제"
            bgColor={"#D83835"}
            widthRatio={LastWidth(1, 2, 18)}
          />

          {/* <TouchableOpacity
            onPress={() => {
              onTodolistDelete(todoid)
              sheetRef.current.snapTo(1)
            }}
          >
            <TodoText>삭제</TodoText>
          </TouchableOpacity> */}
        </FlexView1>
      </>
    </View>
  )
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  const style_tmp = {
    ...pickerSelectStyles,
    iconContainer: {
      top: 20,
      right: 10,
    },
    placeholder: {
      color: "black",
      fontSize: 14,
      fontWeight: "bold",
    },
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ height: "100%" }}
    >
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
                  label: "과목선택...",
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
                    fontSize: 13,
                    fontWeight: "normal",
                  },
                }}
                Icon={() => {
                  return (
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                      size={15}
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
                  label: "과목선택...",
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
              paddingArray={todoArray.todoArray}
              {...todolistName}
              // onChange={() => {}}
              placeholder="  내용(예: 1단원 암기)"
              keyboardType="default"
              returnKeyType="done"
              autoCorrect={false}
              widthRatio={1.8}
            />
          </AddToDoNameView>
          <AddToDoButtonView>
            <AuthButton
              color="white"
              onPress={() => {
                onTodolistAdd()
              }}
              text="추가"
              paddingArray={Platform.OS === "ios" ? [9, 9, 9, 9] : [7, 7, 7, 7]}
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
                    {/* <ColorBox size={"10px"} radius={"16px"} bgColor={list.subject.bgColor} /> */}
                    <TouchableOpacity
                      onPress={() => {
                        onTodolistFinish(list.id)
                        setcheckTouch(!checkTouch)
                      }}
                    >
                      {/* {checkTouch ? (
                      <Icon
                        name={
                          Platform.OS === "ios" ? "ios-checkmark-circle" : "md-checkmark-circle"
                        }
                        size={25}
                        color={list.subject.bgColor}
                      />
                    ) : ( */}
                      <Icon
                        name={
                          Platform.OS === "ios"
                            ? "ios-checkmark-circle-outline"
                            : "md-checkmark-circle-outline"
                        }
                        size={25}
                        color={list.subject.bgColor}
                      />
                      {/* )} */}
                    </TouchableOpacity>
                    <TaskName_todo color={list.subject.bgColor}>
                      {trimText(list.subject.name, 10)}
                    </TaskName_todo>
                  </TaskView>
                  <TaskNameView
                    onPress={() => {
                      sheetRef.current.snapTo(0)
                      setSubject(list.subject.id)
                      titleInput.setValue(list.name)
                      settodoid(list.id)
                    }}
                  >
                    <TodoNameDiv>{trimText(list.name, 15)}</TodoNameDiv>
                  </TaskNameView>
                </IndiviList>
              ))}
            </ScrollView>
          </Widhi100>
        </ListView>
      </MainView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[300, 0]}
        initialSnap={1}
        renderContent={renderContent}
        renderHeader={renderHeader}
        enabledGestureInteraction={true}
        // isBackDrop={true}
        // isBackDropDismisByPress={true}
        // isRoundBorderWithTipHeader={true}
      />
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  label: {
    margin: 8,
  },
  header: {
    backgroundColor: "#f7f5eee8",

    shadowColor: "#000000",
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
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
    backgroundColor: "white",
  },
  inputAndroid: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    backgroundColor: "white",
  },
})
