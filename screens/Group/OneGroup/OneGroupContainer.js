import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import styled from "styled-components"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../../components/Loader"
import {
  SEEONE_GROUP,
  JOIN_GROUP,
  DELETE_GROUP,
  OUT_GROUP,
  OUT_MEMBER,
  EDIT_GROUP,
} from "./OneGroupQueries"
import OneGoupPresenter from "./OneGoupPresenter"
import { SEE_GROUP } from "../SearchGroup/SearchGroupQueries"
import { MY_GROUP } from "../MyGoup/MyGroupQueries"

const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`

export default ({ navigation }) => {
  const { loading, data: groupData, refetch: groupRefetch } = useQuery(SEEONE_GROUP, {
    variables: { groupId: navigation.getParam("id") },
  })
  // variables: { id: navigation.getParam("id") },

  const [joinGroupMutation] = useMutation(JOIN_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [deleteGroupMutation] = useMutation(DELETE_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [outGroupMutation] = useMutation(OUT_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [editGroupMutation] = useMutation(EDIT_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [outMemberMutation] = useMutation(OUT_MEMBER, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  useEffect(() => {}, [])
  return (
    <>
      {loading ? (
        <MainView>
          <Loader />
        </MainView>
      ) : (
        <OneGoupPresenter groupData={groupData.seeOneGroup} navigation={navigation} />
      )}
    </>
  )
}
