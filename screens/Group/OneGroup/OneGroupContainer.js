import React, { useState, useEffect } from "react"
import { Alert } from "react-native"
import styled from "styled-components"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../../components/Loader"
import {
  SEEONE_GROUP,
  JOIN_GROUP,
  DELETE_GROUP,
  OUT_GROUP,
  OUT_MEMBER,
  EDIT_GROUP,
} from "./OneGroupQueries"
import OneGoupPresenter from "./OneGoupPresenter"
import { SEE_GROUP } from "../SearchGroup/SearchGroupQueries"
import { MY_GROUP } from "../MyGoup/MyGroupQueries"
import { gql } from "apollo-boost"

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
export const BOOKMARK_GROUP = gql`
  mutation bookmarkGroup($groupId: String!, $orderBool: Boolean!) {
    bookmarkGroup(groupId: $groupId, orderBool: $orderBool)
  }
`
let playAlert = undefined
export default ({ navigation }) => {
  const [modalPlayVisible, setModalPlayVisible] = useState(false)
  const { loading: MyLoading, data: MyGroupdata, refetch: MyRefetch } = useQuery(MY_GROUP)

  const [modlaOutMember, setmodlaOutMember] = useState(false)
  const { loading, data: groupData, refetch: groupRefetch } = useQuery(SEEONE_GROUP, {
    variables: { groupId: navigation.getParam("id") },
  })
  const search = navigation.getParam("search")
  const { loading: myLoading, data: myData, refetch: myRefetch } = useQuery(ME, {})
  const Groupid = navigation.getParam("id")
  const [joinGroupMutation] = useMutation(JOIN_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [deleteGroupMutation] = useMutation(DELETE_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [outGroupMutation] = useMutation(OUT_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [editGroupMutation] = useMutation(EDIT_GROUP, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [outMemberMutation] = useMutation(OUT_MEMBER, {
    refetchQueries: [{ query: SEE_GROUP }, { query: MY_GROUP }],
  })
  const [bookmarkGroupMutation] = useMutation(BOOKMARK_GROUP)
  const onBookmark = async (groupId, orderBool) => {
    try {
      const {
        data: { bookmarkGroup },
      } = await bookmarkGroupMutation({
        variables: {
          groupId,
          orderBool,
        },
      })
      if (bookmarkGroup) {
        await MyGroupdata()
      }
    } catch (e) {
      console.log(e)
    }
  }
  const onDelete = async (groupId) => {
    Alert.alert("", "정말로 그룹을 삭제하시겠습니까?", [
      {
        text: "YES",
        onPress: () => {
          Delete(groupId)
        },
        style: "cancel",
      },
      {
        text: "NO",
        onPress: () => {
          return
        },
      },
    ])
    const Delete = async (groupId) => {
      try {
        const {
          data: { deleteGroup },
        } = await deleteGroupMutation({
          variables: {
            groupId,
          },
        })
        if (!deleteGroup) {
          Alert.alert("그룹을 삭제할 수 없습니다.")
        } else {
        }
      } catch (e) {
        console.log(e)
      } finally {
        navigation.navigate("TabNavigation")
      }
    }
  }
  const onOut = async (groupId) => {
    Alert.alert("", "정말로 그룹을 떠나시겠습니까?", [
      {
        text: "YES",
        onPress: () => {
          Outgroup(groupId)
        },
        style: "cancel",
      },
      {
        text: "NO",
        onPress: () => {
          return
        },
      },
    ])
    const Outgroup = async (groupId) => {
      try {
        const {
          data: { outGroup },
        } = await outGroupMutation({
          variables: {
            groupId,
          },
        })
        if (!outGroup) {
          Alert.alert("그룹을 떠날 수 없습니다.")
        } else {
        }
      } catch (e) {
        console.log(e)
      } finally {
        navigation.navigate("TabNavigation")
      }
    }
  }

  const onOutMember = async (groupId, memberId) => {
    Alert.alert("", "정말로 그룹원을 추방하시겠습니까?", [
      {
        text: "YES",
        onPress: () => {
          OutMember(groupId, memberId)
        },
        style: "cancel",
      },
      {
        text: "NO",
        onPress: () => {
          return
        },
      },
    ])
    const OutMember = async (groupId, memberId) => {
      try {
        const {
          data: { outMember },
        } = await outMemberMutation({
          variables: {
            groupId,
            memberId,
          },
        })
        if (!outMember) {
          alert("그룹원을 추방할 수 없습니다.")
        } else {
          await groupRefetch()
          // inClose();
          Alert.alert("그룹원을 추방하였습니다.")
        }
      } catch (e) {
        console.log(e)
      } finally {
        setmodlaOutMember(false)
      }
    }
  }
  const onJoin = async (groupId) => {
    try {
      const {
        data: { joinGroup },
      } = await joinGroupMutation({
        variables: {
          groupId,
        },
      })
      if (!joinGroup) {
        Alert.alert("그룹을 가입할 수 없습니다.")
      } else {
        await groupRefetch()
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    playAlert = setInterval(function () {
      groupRefetch()
    }, 60000)
  }, [])
  const clearintervalrefetch = () => {
    clearInterval(playAlert)
  }
  useEffect(() => {
    groupRefetch()
  }, [])
  return (
    <>
      {loading || myLoading || MyLoading ? (
        <MainView>
          <Loader />
        </MainView>
      ) : (
        <OneGoupPresenter
          groupData={groupData.seeOneGroup}
          navigation={navigation}
          Groupid={Groupid}
          groupRefetch={groupRefetch}
          loading={loading}
          myData={myData.me}
          clearintervalrefetch={clearintervalrefetch}
          onDelete={onDelete}
          onOut={onOut}
          modalPlayVisible={modalPlayVisible}
          setModalPlayVisible={setModalPlayVisible}
          modlaOutMember={modlaOutMember}
          setmodlaOutMember={setmodlaOutMember}
          onOutMember={onOutMember}
          onBookmark={onBookmark}
          search={search}
          onJoin={onJoin}
          MyGroupdata={MyGroupdata}
        />
      )}
    </>
  )
}
