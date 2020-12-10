import React, { useState, useEffect } from "react"
import styled from "styled-components"
import EditProfile from "./Edit/EditProfile"

import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
export const ME = gql`
  {
    me {
      id
      avatar
      email
      phoneNumber
      firstName
      lastName
      username
      studyPurpose
      studyGroup
      studyGroup2
      studyGroup3
      address1
      address2
      bio
      loginPosition
      termsOfMarketing
      organization {
        id
        name
        address1
        address2
        detailAddress
      }
      raspberry {
        id
        seatNumber
      }
    }
  }
`

const EmView = styled.View``
const View = styled.View`
  flex: 1;
`

const Account = ({ navigation }) => {
  const { loading, data, refetch } = useQuery(ME, {})
  const [refreshing, setRefreshing] = useState(false)

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
    // console.log(data)
  }, [])

  return (
    <View>
      {loading ? (
        <EmView />
      ) : (
        <EditProfile
          data={data}
          refetch={refetch}
          onRefresh={onRefresh}
          loading={loading}
          navigation={navigation}
        />
      )}
    </View>
  )
}
export default Account
