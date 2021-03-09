import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation } from "@apollo/react-hooks"
import useInput from "../../../hooks/useInput"
import { Alert } from "react-native"

import { studyOption_group } from "../../../components/LongArray"
import useSelect from "../../../hooks/useSelect"
import useSelect_dynamic from "../../../hooks/useSelect_dynamic"
import useSelect_dynamic2 from "../../../hooks/useSelect_dynamic2"
import EditGroupP from "./EditGroupP"
// studyOption_group
const EditGroupC = ({ navigation, data, GroupId, onRefresh, loading, editGroupMutation }) => {
  const maxLen_11 = (value) => value.length <= 12
  const minLen_6 = (value) => value.length < 6 && value.length > 0
  const minLen_1000 = (value) => value.length < 1001

  const name = useInput(data.name, maxLen_11)
  const bio = useInput(data.bio, minLen_1000)
  const password = useInput(data.password, "", minLen_6)
  const studyGroup = useSelect(studyOption_group, data.category)
  return (
    <EditGroupP
      name={name}
      bio={bio}
      password={password}
      studyGroup={studyGroup}
      data={data}
      navigation={navigation}
      editGroupMutation={editGroupMutation}
      GroupId={GroupId}
    />
  )
}

export default EditGroupC
