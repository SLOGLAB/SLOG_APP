import React, { useState, useEffect } from "react"
import { Alert, ScrollView, RefreshControl, SafeAreaView } from "react-native"
import styled from "styled-components"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Loader from "../../../components/Loader"
import { MY_GROUP, BOOKMARK_GROUP } from "./MyGroupQueries"
import MyGoupPresenter from "./MyGoupPresenter"
const MainView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
let playAlert = undefined

export default ({ navigation }) => {
  const { loading, data, refetch } = useQuery(MY_GROUP)
  const [refreshing, setRefreshing] = useState(false)

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
      if (!bookmarkGroup) {
        Alert.alert("그룹을 북마크할 수 없습니다.")
      } else {
        await refetch()
      }
    } catch (e) {
      console.log(e)
      Alert.alert("그룹 북마크는 1개만 가능합니다. ")
    }
  }

  return (
    <>
      {loading ? (
        <MainView>
          <Loader />
        </MainView>
      ) : (
        <MyGoupPresenter
          groupData={data.myGroup}
          groupRefetch={refetch}
          onBookmark={onBookmark}
          navigation={navigation}
        />
      )}
    </>
  )
}
