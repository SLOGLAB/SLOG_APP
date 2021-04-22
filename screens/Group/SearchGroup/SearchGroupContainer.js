import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useMutation, useQuery } from "@apollo/react-hooks"
import useInput from "../../../hooks/useInput"
import { Alert, SafeAreaView } from "react-native"

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
const filterArray = ["최신순", "높은 출석률순"]
const filterArray_value = ["createdAt_DESC", "lastAttendance_DESC"]

const getAll = studyOption_group.slice()
getAll.unshift("전체")
export const feedTerm = 20

const SearchGroupContainer = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false)
  const [modlaOutMember, setmodlaOutMember] = useState(false)

  const [empty, setEmpty] = useState(false)
  const [first, setFirst] = useState(feedTerm)

  const categroyFilter = useSelect(getAll, getAll)
  const orderFilter = useSelect(filterArray, filterArray_value)
  const [publicBool, setPublicBool] = useState(false)

  const [variables, setVariables] = useState({
    category: getAll[0],
    orderBy: filterArray_value[0],
    publicBool,
    empty,
    first,
  })
  const { loading, data: groupData, refetch: groupRefetch } = useQuery(SEE_GROUP, {
    variables,
  })
  const { loading: myLoading, data: myData, refetch: myRefetch } = useQuery(ME)

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
  useEffect(() => {
    console.log(groupData)
  }, [])

  console.log(groupData)
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
