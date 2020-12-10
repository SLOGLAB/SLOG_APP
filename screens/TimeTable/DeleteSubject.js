import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { DELETE_SUBJECT } from "./TimeTableQueries"
import { SUBJECT_NAME } from "../Tabs/QueryBox"
import DeleteSubPage from "./TimeTableMenu/DeleteSubPage"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import { SCHEDULE_USER } from "../AWeekTime/TimetableWeek"
import Loader from "../../components/Loader"
const MenuView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export default DeleteSubject = ({ navigation }) => {
  const [subjectId, setSubjectId] = useState("")
  const { loading, data, refetch } = useQuery(SUBJECT_NAME, {
    // pollInterval: 300000, //5분마다
    // notifyOnNetworkStatusChange: true,
  })
  const [deleteSubjectMutation] = useMutation(DELETE_SUBJECT, {
    variables: {
      subjectId: subjectId,
    },
    refetchQueries: () => [{ query: SUBJECT_NAME }, { query: SCHEDULE_USER }],
  })
  const goback = () => {
    navigation.navigate("Timecontrol")
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MenuView>
        {loading ? (
          <Loader />
        ) : (
          <DeleteSubPage
            subjectList={data.mySubject}
            goback={goback}
            refetch={refetch}
            subjectId={subjectId}
            setSubjectId={setSubjectId}
            deleteSubjectMutation={deleteSubjectMutation}
          />
        )}
      </MenuView>
    </TouchableWithoutFeedback>
  )
}
