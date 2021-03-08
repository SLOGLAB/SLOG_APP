import React, { useState, useEffect } from "react"
import styled from "styled-components"
import EditGroupC from "./EditGroupC"

import { useQuery, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { MY_GROUP } from "../MyGoup/MyGroupQueries"
import { EDIT_GROUP, SEEONE_GROUP } from "../OneGroup/OneGroupQueries"
import { SEE_GROUP } from "../SearchGroup/SearchGroupQueries"

const EmView = styled.View``
const View = styled.View`
  flex: 1;
`

const EditGroup = ({ navigation }) => {
  //   const { loading, data, refetch } = useQuery(SEEONE_GROUP, {
  //     variables: { groupId: navigation.getParam("id") },
  //   })
  const { loading, data, refetch } = useQuery(MY_GROUP, {})
  const [refreshing, setRefreshing] = useState(false)
  const selectIndex = data.myGroup.findIndex((a) => a.id === navigation.getParam("id"))
  const GroupId = navigation.getParam("id")
  const [editGroupMutation] = useMutation(EDIT_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await refetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }
  useEffect(() => {
    onRefresh()
  }, [])

  return (
    <View>
      {loading ? (
        <EmView />
      ) : (
        <>
          <EditGroupC
            data={data.myGroup[selectIndex]}
            refetch={refetch}
            onRefresh={onRefresh}
            loading={loading}
            navigation={navigation}
            editGroupMutation={editGroupMutation}
            GroupId={GroupId}
          />
        </>
      )}
    </View>
  )
}
export default EditGroup
