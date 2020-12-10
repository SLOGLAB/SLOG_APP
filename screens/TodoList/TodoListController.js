import React, { useState, useEffect } from "react"
import TodoList from "./TodoList"
import { ScrollView, RefreshControl, TouchableOpacity, Button, Platform, Alert } from "react-native"

import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../components/Loader"
import useInput from "../../hooks/useInput"
import styled from "styled-components"
import { gql } from "apollo-boost"
import {
  MY_SUBJECT,
  MY_TODOLIST,
  ADD_TODOLIST,
  DELETE_TODOLIST,
  FINISH_TODOLIST,
} from "../Tabs/QueryBox"
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
      {todolistLoading && subjectLoading ? (
        <Loader />
      ) : (
        <TodoList
          subjectData={subjectData}
          subjectRefetch={subjectRefetch}
          todolistData={todolistData}
          todolistRefetch={todolistRefetch}
          addTodolistMutation={addTodolistMutation}
          deleteTodolistMutation={deleteTodolistMutation}
          finishTodolistMutation={finishTodolistMutation}
          refreshing={refreshing}
          onRefresh={onRefresh}
          todolistName={todolistName}
          subjectList={subjectData.mySubject}
        />
      )}
    </>
  )
}
