import React, { useState } from "react"
import styled from "styled-components"
import { Alert, FlatList, Dimensions } from "react-native"
import CheckBoxs from "../../../components/CheckBoxs"
import { useMutation } from "@apollo/react-hooks"
import { EDIT_BOOKMARK } from "../../../screens/TimeTable/TimeTableQueries"
import AuthButton from "../../../components/AuthButton"
import { SUBJECT_NAME } from "../../../screens/Tabs/QueryBox"
import { SCHEDULE_USER } from "../../AWeekTime/TimetableWeek"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

const TopView = styled.View`
  width: 100%;
  padding-left: 30px;
  padding-top: 30;
  height: 90%;
`

const BottomView = styled.View`
  margin: 35px 0 35px 0;
`

const CheckView = styled.View`
  flex-direction: row;
  margin-bottom: 10;
`

const Text1 = styled.Text`
  margin-left: 15;
`

export default Bookmark = ({ subjectList, goback, refetch, loading }) => {
  // '기타' 북마크 못건드리게 제거
  const etcIndex = subjectList.findIndex((a) => a.name === "기타")
  if (etcIndex !== -1) {
    subjectList.splice(etcIndex, 1)
  }

  const [modifyLoading, setModifyLoading] = useState(false)
  const [bookMarkCh, setBookMarkCh] = useState(
    subjectList.map((_, j) => {
      return subjectList[j].bookMark
    })
  )
  const [bookmarkSubjectMutation] = useMutation(EDIT_BOOKMARK, {
    variables: {
      subjectId: subjectList.map((_, i) => {
        return subjectList[i].id
      }),
      bookMark: bookMarkCh,
    },
    refetchQueries: () => [{ query: SUBJECT_NAME }, { query: SCHEDULE_USER }],
  })

  //////////
  const onChangeCheck = (index) => (e) => {
    let newArr = [...bookMarkCh]
    newArr[index] = !bookMarkCh[index]
    setBookMarkCh(newArr)
  }
  const renderItem = ({ index }) => {
    return (
      <CheckView>
        <CheckBoxs
          checked={bookMarkCh[index]}
          onChange={onChangeCheck(index)}
          subjectList={subjectList[index]}
        />
        <Text1>{subjectList[index].name}</Text1>
      </CheckView>
    )
  }

  const onClickBookMark = async () => {
    try {
      setModifyLoading(true)
      const {
        data: { bookMarkSubject },
      } = await bookmarkSubjectMutation()
      if (!bookMarkSubject) {
        Alert.alert("북마크를 변경할 수 없습니다.")
      } else {
        refetch()
      }
    } catch (e) {
      const realText = e.message.split("GraphQL error: ")
      Alert.alert(realText[1])
    } finally {
      setModifyLoading(false)
      goback()
    }
  }
  return (
    // <ScrollView>
    <>
      <TopView>
        <FlatList
          LisHeaderComponent={<></>}
          data={bookMarkCh}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </TopView>
      <BottomView>
        <AuthButton
          color="white"
          onPress={onClickBookMark}
          bgColor={"#0f4c82"}
          text="저 장"
          loading={modifyLoading}
        />
      </BottomView>
    </>
    // </ScrollView>
  )
}
////////
{
  /* <ListWrap>
  <BookmarkList
    height={300}
    itemCount={subjectList.length}
    itemSize={8}
    width={300}
  >
    {SubjectRow}
  </BookmarkList>
</ListWrap>
<ButtonDiv>
  <PopupButton text={'저장'} />
  <PopupButton
    type="button"
    onClick={() => {
      close();
      setBookMarkCh(
        subjectList.map((_, index) => {
          return subjectList[index].bookMark;
        }),
      );
    }}
    text={'닫기'}
  />
</ButtonDiv> */
}

///
