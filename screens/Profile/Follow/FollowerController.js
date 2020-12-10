import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import styled from "styled-components"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import useInput from "../../../hooks/useInput"
import { ME } from "../UserProfile"
import FollowerPresenter from "./FollowerPresenter"

export const DISCONNECT_STUDENT = gql`
  mutation disconnectStudent {
    disconnectStudent
  }
`

export const CONNECT_STUDENT = gql`
  mutation connectStudent($secretCode: String!, $raspberrySerial: String!) {
    connectStudent(secretCode: $secretCode, raspberrySerial: $raspberrySerial)
  }
`
export const ADD_FOLLOW = gql`
  mutation addFollow($inputStr: String!) {
    addFollow(inputStr: $inputStr)
  }
`

export const UN_FOLLOW = gql`
  mutation unfollow($id: String!) {
    unfollow(id: $id)
  }
`

export const FOLLOW = gql`
  mutation follow($id: String!) {
    follow(id: $id)
  }
`
const EmView = styled.View``

const FollowweController = ({ navigation }) => {
  const { loading, data, refetch } = useQuery(ME, {})
  const [refreshing, setRefreshing] = useState(false)
  const raspberrySerial = useInput("")
  const secretCode = useInput("")
  const followInput = useInput("")

  const [disconnectStudentMutation] = useMutation(DISCONNECT_STUDENT)
  const [connectStudentMutation] = useMutation(CONNECT_STUDENT)
  const [addFollowMuation] = useMutation(ADD_FOLLOW, {
    refetchQueries: () => [{ query: ME }],
  })
  const [unFollowMuation] = useMutation(UN_FOLLOW, {
    refetchQueries: () => [{ query: ME }],
  })
  const [followMuation] = useMutation(FOLLOW, { refetchQueries: () => [{ query: ME }] })

  const onAddFollow = async () => {
    try {
      // toast.info('새로운 팔로우 추가 중...');
      const {
        data: { addFollow },
      } = await addFollowMuation({
        variables: { inputStr: followInput.value },
      })
      if (!addFollow) {
        Alert.alert("팔로우를 추가할 수 없습니다.")
      } else {
        followInput.setValue("")
        await refetch()
        Alert.alert("새로운 팔로우가 추가 되었습니다.")
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      console.log(realText[1])
    }
  }
  const onUnRegist = async (organizationNonExist) => {
    if (organizationNonExist) {
      // Alert.alert("등록된 독서실(좌석)이 없습니다.")
      Alert.alert("등록된 Meta가 없습니다.")
    } else {
      try {
        const {
          data: { disconnectStudent },
        } = await disconnectStudentMutation()
        if (!disconnectStudent) {
          // Alert.alert("좌석을 해제할 수 없습니다.")
          Alert.alert("Meta를 해제할 수 없습니다.")
        } else {
          // await userRefetch()
          Alert.alert("Meta 해제가 완료되었습니다.")
        }
      } catch (e) {
        const realText = e.message.split("GraphQL error: ")
        Alert.alert(realText[1])
      }
    }
  }

  const clearOnRegist = () => {
    raspberrySerial.setValue("")
    secretCode.setValue("")
  }

  const onRegist = async () => {
    try {
      const {
        data: { connectStudent },
      } = await connectStudentMutation({
        variables: {
          secretCode: secretCode.value,
          raspberrySerial: raspberrySerial.value,
        },
      })
      if (!connectStudent) {
        // Alert.alert("좌석을 연결할 수 없습니다.")
        Alert.alert("Meta을 연결할 수 없습니다.")
      } else {
        await clearOnRegist()
        Alert.alert("Meta 연결이 완료되었습니다.")
        return true
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
      return false
    }
  }
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
    <>
      {loading ? (
        <EmView />
      ) : (
        <FollowerPresenter
          data={data}
          onRefresh={onRefresh}
          navigation={navigation}
          loading={loading}
          raspberrySerial={raspberrySerial}
          secretCode={secretCode}
          onRegist={onRegist}
          onUnRegist={onUnRegist}
          followInput={followInput}
          onAddFollow={onAddFollow}
          unFollowMuation={unFollowMuation}
          followMuation={followMuation}
          refreshing={refreshing}
          refetch={refetch}
        />
      )}
    </>
  )
}
export default FollowweController
