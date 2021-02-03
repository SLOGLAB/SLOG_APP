import React, { useState, useEffect } from "react"
import { ScrollView, Alert, RefreshControl, Dimensions } from "react-native"
import styled from "styled-components"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import useInput from "../../hooks/useInput"

import Profiledetail from "./Profiledetail"

export const ME = gql`
  {
    me {
      id
      avatar
      email
      fullName
      username
      studyPurpose
      studyGroup
      studyGroup2
      studyGroup3
      bio
      followingCount
      followersCount
      isFollowing
      followDates {
        id
        followId
        createdAt
      }
      following {
        id
        avatar
        email
        username
        isFollowing
        isSelf
      }
      followers {
        id
        avatar
        email
        username
        isFollowing
        isSelf
        followDates {
          id
          followId
          createdAt
        }
      }
      posts {
        id
        files {
          id
          url
          key
        }
        likeCount
        commentCount
      }
      organization {
        id
        name
        manager {
          id
          phoneNumber
        }
      }
      raspberry {
        id
        seatNumber
      }
    }
  }
`
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

const EmView = styled.View``
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

const UserProfile = ({ navigation }) => {
  const { loading, data, refetch } = useQuery(ME, {})
  const feedTerm = 20
  const [variables, setVariables] = useState({ first: feedTerm })

  const [refreshing, setRefreshing] = useState(false)
  const raspberrySerial = useInput("")
  const secretCode = useInput("")
  const followInput = useInput("")

  const [disconnectStudentMutation] = useMutation(DISCONNECT_STUDENT)
  const [connectStudentMutation] = useMutation(CONNECT_STUDENT)

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
    <ScrollView
      style={{
        backgroundColor: "rgba(233, 237, 244, 1)",
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: "#E9EDF4" }}
        />
      }
    >
      {loading ? (
        <EmView />
      ) : (
        <Profiledetail
          data={data}
          onRefresh={onRefresh}
          navigation={navigation}
          loading={loading}
          raspberrySerial={raspberrySerial}
          secretCode={secretCode}
          onRegist={onRegist}
          onUnRegist={onUnRegist}
        />
      )}
    </ScrollView>
  )
}
{
  /* <MainView style={{ marginTop: 30 }}>
    <AuthButton onPress={check} text="출석" />
  </MainView> */
}

// UserProfile.propTypes = {
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
export default UserProfile
