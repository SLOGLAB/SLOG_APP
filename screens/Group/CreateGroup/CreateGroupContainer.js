import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation } from "@apollo/react-hooks"
import useInput from "../../../hooks/useInput"
import { Alert } from "react-native"

import { studyOption_group } from "../../../components/LongArray"
import useSelect from "../../../hooks/useSelect"
import { CREATE_GROUP } from "../SearchGroup/SearchGroupQueries"
import CreateGroupPresenter from "./CreateGroupPresenter"
import { MY_GROUP } from "../MyGoup/MyGroupQueries"
// studyOption_group
const CreateGroupContainer = ({ navigation }) => {
  const [createGroupMutation] = useMutation(CREATE_GROUP, {
    refetchQueries: [{ query: MY_GROUP }],
  })
  const maxLen_11 = (value) => value.length <= 12
  const minLen_6 = (value) => value.length < 6 && value.length > 0
  const minLen_1000 = (value) => value.length < 1001

  const name = useInput("", maxLen_11)
  const bio = useInput("", minLen_1000)
  const password = useInput("", "", minLen_6)
  const studyGroup = useSelect(studyOption_group)
  return (
    <CreateGroupPresenter
      name={name}
      bio={bio}
      password={password}
      studyGroup={studyGroup}
      navigation={navigation}
      createGroupMutation={createGroupMutation}
    />
  )
}

export default CreateGroupContainer
