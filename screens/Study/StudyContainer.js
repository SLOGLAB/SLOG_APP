import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native"
import StudyPresenter from "./StudyPresenter"
import BackButton from "../../components/BackButton"
import constants from "../../constants"
import {
  MY_SUBJECT,
  MY_TODOLIST,
  ADD_TODOLIST,
  DELETE_TODOLIST,
  FINISH_TODOLIST,
} from "../Tabs/QueryBox"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
// import SwipeMenu from "../../components/SwipeMenu"
// import Apps from "../../Object/Apps"
const Main = styled.View`
  flex: 1;
`
const TopView = styled.View`
  height: ${constants.height / 18};
  background-color: rgba(15, 76, 130, 0.29);
  align-items: flex-start;
  justify-content: flex-end;
`
const SideView = styled.View`
  flex: 0.55;
`
const SideView1 = styled.View`
  flex: 0.45;
`
const AvatarView = styled.View`
  flex: 1;
`
const StudyView = styled.View`
  flex: 3;
  background-color: rgba(15, 76, 130, 0.29);
`
const TimeView = styled.View`
  flex: 1;
`
const RowView = styled.View`
  flex-direction: row;
`
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

export default () => {
  const [refreshing, setRefreshing] = useState(false)
  const todolistName = useInput("")

  const [addTodolistMutation] = useMutation(ADD_TODOLIST)
  const [deleteTodolistMutation] = useMutation(DELETE_TODOLIST)
  const [finishTodolistMutation] = useMutation(FINISH_TODOLIST)
  const {
    data: subjectData,
    loading: subjectLoading,
    refetch: subjectRefetch,
    networkStatus: subjectnetwork,
  } = useQuery(MY_SUBJECT, { notifyOnNetworkStatusChange: true })
  const { data: todolistData, loading: todolistLoading, refetch: todolistRefetch } = useQuery(
    MY_TODOLIST
  )

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await subjectRefetch()
      await todolistRefetch()
    } catch (error) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    onRefresh()
  }, [])
  return (
    <>
      <Main>
        <TopView>
          <BackButton />
        </TopView>
        <RowView>{/* <AvatarView>
            </AvatarView> */}</RowView>
      </Main>
    </>
  )
}
