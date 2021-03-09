import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation, useQuery } from "@apollo/react-hooks"
import useInput from "../../../hooks/useInput"
import { Alert } from "react-native"

import { studyOption_group } from "../../../components/LongArray"
import useSelect from "../../../hooks/useSelect"
import SearchGroupPresenter from "./SearchGroupPresenter"
import { SEE_GROUP } from "./SearchGroupQueries"
import { SEEONE_GROUP } from "../OneGroup/OneGroupQueries"
import Loader from "../../../components/Loader"
import { gql } from "apollo-boost"

// studyOption_group
const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
export const ME = gql`
  {
    me {
      id
      username
    }
  }
`
const SearchGroupContainer = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false)
  const [modlaOutMember, setmodlaOutMember] = useState(false)

  const { loading, data: groupData, refetch: groupRefetch } = useQuery(SEE_GROUP)
  const { loading: myLoading, data: myData, refetch: myRefetch } = useQuery(ME, {})

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await groupRefetch()
      await myRefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }
  return (
    <>
      {loading || myLoading ? (
        <MainView>
          <Loader />
        </MainView>
      ) : (
        <SearchGroupPresenter
          groupData={groupData.seeGroup}
          groupRefetch={groupRefetch}
          navigation={navigation}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          onRefresh={onRefresh}
          loading={loading}
          myData={myData}
          modlaOutMember={modlaOutMember}
          setmodlaOutMember={setmodlaOutMember}
        />
      )}
    </>
  )
}

export default SearchGroupContainer
