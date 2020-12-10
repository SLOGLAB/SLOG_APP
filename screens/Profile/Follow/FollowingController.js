import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import styled from "styled-components"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import useInput from "../../../hooks/useInput"
import { ME } from "../UserProfile"
import FollowingPresenter from "./FollowingPresenter"

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
export const GO_WITH = gql`
  mutation goWith($followDateId: String!, $goWithBool: Boolean!) {
    goWith(followDateId: $followDateId, goWithBool: $goWithBool)
  }
`
const EmView = styled.View``

const FollowingController = ({ navigation }) => {
  const { loading, data, refetch } = useQuery(ME, {})
  const [refreshing, setRefreshing] = useState(false)
  const raspberrySerial = useInput("")
  const secretCode = useInput("")
  const followInput = useInput("")

  const [addFollowMuation] = useMutation(ADD_FOLLOW, {
    refetchQueries: () => [{ query: ME }],
  })
  const [unFollowMuation] = useMutation(UN_FOLLOW, {
    refetchQueries: () => [{ query: ME }],
  })
  const [followMuation] = useMutation(FOLLOW, {
    refetchQueries: () => [{ query: ME }],
  })
  const [goWithMutation] = useMutation(GO_WITH, {
    // refetchQueries: () => [{ query: ME }],
  })

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
        <FollowingPresenter
          data={data}
          onRefresh={onRefresh}
          navigation={navigation}
          loading={loading}
          followInput={followInput}
          onAddFollow={onAddFollow}
          unFollowMuation={unFollowMuation}
          followMuation={followMuation}
          refreshing={refreshing}
          goWithMutation={goWithMutation}
          refetch={refetch}
        />
      )}
    </>
  )
}

// FollowingController.propTypes = {
//   id: PropTypes.string.isRequired,
//   avatar: PropTypes.string.isRequired,
//   username: PropTypes.string.isRequired,
//   fullName: PropTypes.string.isRequired,
//   isFollowing: PropTypes.bool.isRequired,
//   isSelf: PropTypes.bool.isRequired,
//   // bio: PropTypes.string.isRequired,
//   followingCount: PropTypes.number.isRequired,
//   followersCount: PropTypes.number.isRequired,
//   postsCount: PropTypes.number.isRequired,
//   posts: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       user: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         avatar: PropTypes.string,
//         username: PropTypes.string.isRequired,
//       }).isRequired,
//       files: PropTypes.arrayOf(
//         PropTypes.shape({
//           id: PropTypes.string.isRequired,
//           url: PropTypes.string.isRequired,
//         })
//       ).isRequired,
//       likeCount: PropTypes.number.isRequired,
//       isLiked: PropTypes.bool.isRequired,
//       comments: PropTypes.arrayOf(
//         PropTypes.shape({
//           id: PropTypes.string.isRequired,
//           text: PropTypes.string.isRequired,
//           user: PropTypes.shape({
//             id: PropTypes.string.isRequired,
//             username: PropTypes.string.isRequired,
//           }).isRequired,
//         })
//       ).isRequired,
//       caption: PropTypes.string.isRequired,
//       location: PropTypes.string,
//       createdAt: PropTypes.string.isRequired,
//     })
//   ),
// }
export default FollowingController
