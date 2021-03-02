import React, { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { USER_FRAGMENT } from "../../fragments"
import Loader from "../../components/Loader"
import { ScrollView } from "react-native"
import UserDetailPresenter from "./UserDetailPresenter"

const GET_USER = gql`
  query seeUser($username: String!) {
    seeUser(username: $username) {
      id
      avatar
      username
      bio
      fullName
      isSelf
      email
      studyPurpose
      studyGroup
      studyGroup2
      studyGroup3
      pubOfFeed
      pubOfStatistic
      pubOfSchedule
      postsCount
      followingCount
      followersCount
      isFollowing
      isFollowed
      times {
        existTime
        time_24
        createdAt
      }
      schedules {
        id
        isAllDay
        isPrivate
        title
        location
        state
        start
        end
        totalTime
        subject {
          id
          name
          bgColor
        }
      }
      studyDefaultSet {
        timelapseRecord
        nonScheduleRecord
        autoRefresh
        autoRefreshTerm
        startScheduleTerm
        cutExtenTerm
        scheduleStart
        scheduleEnd
        dDayOn
        dDateName
        dDate
      }
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
    }
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
export default ({ navigation }) => {
  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: { username: navigation.getParam("username") },
  })
  const [addFollowMuation] = useMutation(FOLLOW)
  const [unFollowMuation] = useMutation(UN_FOLLOW)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const myname = navigation.getParam("myname")
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
    <ScrollView>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeUser && (
          <UserDetailPresenter
            data={data}
            navigation={navigation}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            modalVisible2={modalVisible2}
            setModalVisible2={setModalVisible2}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            onRefresh={onRefresh}
            addFollowMuation={addFollowMuation}
            unFollowMuation={unFollowMuation}
            refetch={refetch}
            myname={myname}
          />
        )
      )}
    </ScrollView>
  )
}
