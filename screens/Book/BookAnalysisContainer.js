import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"

import Loader from "../../components/Loader"
import Icon from "../../components/Icon"
import AuthInput from "../../components/AuthInput"
import AuthButton from "../../components/AuthButton"
import LastWidth from "../../components/LastWidth"

import { Ionicons } from "@expo/vector-icons"
import { ScrollView, RefreshControl, Image, Alert, Dimensions, StyleSheet } from "react-native"
import styles from "../../styles"
import Modal from "react-native-modal"
import constants from "../../constants"
import { TouchableOpacity } from "react-native-gesture-handler"
import useInput from "../../hooks/useInput"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { SafeAreaView } from "react-navigation"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
import { Calendar } from "react-native-calendars"
import { SUBJECT_NAME } from "../Tabs/QueryBox"
import RNPickerSelect from "react-native-picker-select"
import { CREATE_BOOKOFUSER, SEARCH_BOOK } from "./BookAnalysisQueries"
import { SEE_USERBOOK } from "../MyStudy/MyStudyQueries"

const StatName = styled.Text`
  font-size: 12;
  font-family: "GmarketMedium";

  color: ${styles.darkGreyColor};
  /* margin-left: 8;
  margin-right: 8; */
`
const TopView = styled.View`
  flex-direction: row;
  height: 50;
  align-items: center;
  justify-content: center;
`
const FlexBox = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const FlexTouchBox = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const FlexBox2 = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: 10;
`
const FlexBox3 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const FlexBox4 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-width: 1;
  border-radius: 5;
  border-color: #3b8df5;
  padding-top: 5px;
  padding-bottom: 5px;
  height: 25;
`
const MainText = styled.Text`
  font-size: 17;
  font-family: "GmarketBold";

  color: #0f4c82;
`
const MainView = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
`
const SearchView = styled.View`
  height: 50;
  width: 100%;
  flex-direction: row;
  margin-left: 5;
  margin-right: 5;
  align-items: center;
  justify-content: center;
`
const SearchButtonView = styled.View`
  width: 32%;
  flex-direction: row;
`
const SearchBarView = styled.View`
  width: 68%;
  /* height: 50; */
`
const BoxBottomView = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 5;
  margin-top: 0;
  height: 50;
`
const GroupBox = styled.TouchableOpacity`
  width: 90%;
  justify-content: flex-start;
  /* border-radius: 10; */
  padding: 0px;
  border-color: rgba(196, 196, 196, 1);
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 5px;
  /* margin-left: 10px;
  margin-right: 10px; */
  flex-direction: row;
  height: 90;
  /* border-width: 1; */
`
const BoxView = styled.View`
  flex: 3;
  justify-content: center;
  align-items: flex-start;
  background-color: rgba(255, 255, 255, 1);
`
const GroupBookBox = styled.View`
  width: 100%;
  justify-content: flex-start;
  /* border-radius: 10; */
  padding: 2px;
  border-color: rgba(196, 196, 196, 1);
  /* background-color: rgba(59, 141, 245, 1); */
  /* margin-left: 10px;
  margin-right: 10px; */
  flex-direction: row;
  height: 150;
`
const BoxBookView = styled.View`
  flex: 1.5;
  margin-left: 0px;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
`
const RowBookGroup = styled.View`
  flex-direction: row;
`
const RowBookGroup2 = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 15;
`
const BookName = styled.Text`
  font-family: "GmarketMedium";
  font-size: 15;
  margin-top: 10;
`
const GroupText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 10;
  margin-right: 5;
`
const GroupText2 = styled.Text`
  font-family: "GmarketMedium";
  font-size: 10;
`
const GroupTimeText = styled.Text`
  font-family: "GmarketMedium";
  font-size: 15;
  color: #3b8df5;
`
const GroupTimeText2 = styled.Text`
  font-family: "GmarketMedium";
  font-size: 10;
  color: #3b8df5;
`
const GroupGreyText = styled.Text`
  font-family: "GmarketMedium";
  color: #c7c7c7;
  font-size: 10;
  margin-right: 5;
`
const RowGroup = styled.View`
  flex-direction: row;
`
const ListView = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0;
  border-width: 0;
  border-color: rgba(196, 196, 196, 1);
  /* margin-left: 5;
  margin-right: 5; */
  height: 80%;
  margin-top: 15;
`
const Widhi100 = styled.View`
  width: 10;
`

const StyledPlayModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.35;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0px;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
`
const MaginTopView = styled.View`
  margin-top: 10;
`

const LineView2 = styled.View`
  width: 100%;
  height: 2px;
  margin-bottom: 10;
  background-color: #000;
`
let bookList = []
export default ({ navigation }) => {
  const { loading, data, refetch } = useQuery(SUBJECT_NAME, {
    // pollInterval: 300000, //5분마다
    // notifyOnNetworkStatusChange: true,
  })
  const [subjectId, setSubjectId] = useState("")
  const list = data.mySubject.map((file) => ({
    label: file.name,
    value: file.id,
  }))
  const [selectDate, setSelectDate] = useState(new Date())
  const [selectDate2, setSelectDate2] = useState(new Date())

  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)

  const [modalPlayVisible, setModalPlayVisible] = useState(false)
  const [selectDay, setselectDay] = useState(targetToday)
  const [selectDay2, setselectDay2] = useState(targetToday)

  const trimText = (text = "", limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text)

  const [refreshing, setRefreshing] = useState(false)
  const scrollViewRef = useRef()

  const titleInput = useInput("")
  const bookstartInput = useInput("1")
  const bookendInput = useInput("100")

  const feedCount = 10
  const [display, setDisplay] = useState(feedCount)
  const [bookLoad, setBookLoad] = useState(false)
  const [bookInfo, setBookInfo] = useState({
    image: "",
    title: "",
    author: "",
    publisher: "",
    link: "",
    isbn: "",
  })

  const [searchBookMutation] = useMutation(SEARCH_BOOK)
  const [createBookOfUserMutation] = useMutation(CREATE_BOOKOFUSER, {
    refetchQueries: [{ query: SEE_USERBOOK }],
  })
  const onSearchFuc = async (i) => {
    if (titleInput.value === "") {
      Alert.alert("검색어를 입력하세요.")
    }
    try {
      setBookLoad(true)
      const {
        data: { searchBook },
      } = await searchBookMutation({
        variables: {
          word: titleInput.value,
          display: i,
        },
      })
      if (!searchBook) {
        Alert.alert("교재를 검색할 수 없습니다.")
      } else {
        bookList = [...searchBook]
      }
    } catch (e) {
      console.log(e)
    } finally {
      setBookLoad(false)
    }
  }
  const onRefresh = async () => {
    try {
      setRefreshing(true)
      // await groupRefetch()
    } catch (e) {
    } finally {
      setRefreshing(false)
    }
  }
  // const clearValue = () => {
  //   startPage.setValue(1)
  //   endPage.setValue(100)
  //   setStartDate(nowDate)
  //   setEndDate(nextMonthDate)
  // }
  const onCreateUserBook = async (book) => {
    // e.preventDefault(); // form에서 쓰이는거
    try {
      const {
        data: { createBookOfUser },
      } = await createBookOfUserMutation({
        variables: {
          title: book.title,
          link: book.link,
          image: book.image,
          author: book.author,
          publisher: book.publisher,
          isbn: book.isbn,
          subjectId: subjectId,
          startPage: Number(bookstartInput.value),
          endPage: Number(bookendInput.value),
          startDate: selectDate,
          endDate: selectDate2,
        },
      })
      if (!createBookOfUser) {
        Alert.alert("교재를 등록할 수 없습니다.")
      } else {
        // clearValue()
        // setViewForm('default');
        setModalPlayVisible(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  // titleInput.value
  return (
    <SafeAreaView>
      <TopView>
        <FlexBox2>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TabNavigation")
              bookList = []
            }}
          >
            <Icon
              name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
              color={"#000000"}
              size={40}
            />
          </TouchableOpacity>
        </FlexBox2>
        <FlexBox>
          {Platform.OS === "ios" ? <MainText>책 검색</MainText> : <MainText2>책 검색</MainText2>}
        </FlexBox>
        <FlexTouchBox onPress={() => {}}></FlexTouchBox>
      </TopView>
      <SearchView>
        <SearchBarView>
          <AuthInput
            {...titleInput}
            placeholder={"교재의 제목 또는 ISBN(-제외)을 입력하세요."}
            keyboardType="default"
            returnKeyType="done"
            widthRatio={1.5}
            // onSubmitEditing={handleLogin}
            autoCorrect={false}
          />
        </SearchBarView>
        <SearchButtonView>
          <AuthButton
            color="white"
            onPress={() => {
              onSearchFuc(feedCount)
              setDisplay(feedCount)
            }}
            text="검색"
            bgColor={"#4181F7"}
            widthRatio={LastWidth(1, 2, 3)}
          />
          <Widhi100 />
          <TouchableOpacity onPress={() => navigation.navigate("QRcode")}>
            <Ionicons
              name={Platform.OS === "ios" ? "ios-qr-scanner" : "md-qr-scanner"}
              color={"#0F4C82"}
              size={20}
            />
            <StatName>QR</StatName>
          </TouchableOpacity>
        </SearchButtonView>
        {/* <SearchButtonView>
        </SearchButtonView> */}
      </SearchView>
      <ListView>
        <>
          <ScrollView
            style={{ backgroundColor: "#FFFFFF", flex: 1 }}
            ref={scrollViewRef}
            onContentSizeChange={() => {
              // 여기다가 어떤 경우에 스크롤을 하면 될지에 대한 조건문을 추가하면 된다.
              //   scrollViewRef.scrollToEnd({ animated: false })
              //   scrollViewRef.scrollView.scrollTo(0)
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                style={{ backgroundColor: "#FFFFFF" }}
              />
            }
          >
            {bookList.map((list) => (
              // {BoxCount.map((list) => (
              <GroupBox
                key={list.id}
                onPress={() => {
                  setModalPlayVisible(true)
                  setBookInfo({
                    image: list.image,
                    title: list.title,
                    author: list.author,
                    publisher: list.publisher,
                    link: list.link,
                    isbn: list.isbn,
                  })
                }}
              >
                <Image source={{ uri: list.image }} style={{ flex: 1 }} resizeMode="contain" />
                <BoxView>
                  <RowGroup>
                    <GroupGreyText>제목 :</GroupGreyText>
                    <GroupText>{trimText(list.title, 100)}</GroupText>
                  </RowGroup>
                  <RowGroup>
                    <GroupGreyText>저자 :</GroupGreyText>
                    <GroupText>{list.author}</GroupText>
                  </RowGroup>
                  <RowGroup>
                    <GroupGreyText>출판사 :</GroupGreyText>
                    <GroupText>{list.publisher}</GroupText>
                  </RowGroup>

                  <RowGroup>
                    <GroupGreyText>ISBN :</GroupGreyText>
                    <GroupText>{list.isbn}</GroupText>
                  </RowGroup>
                </BoxView>
              </GroupBox>
            ))}
            {bookList.length == 0 ? null : (
              <BoxBottomView>
                <AuthButton
                  color="white"
                  onPress={() => {
                    const newDisplay = display + feedCount
                    setDisplay(newDisplay)
                    onSearchFuc(newDisplay)
                  }}
                  text="더보기"
                  paddingArray={Platform.OS === "ios" ? [6.5, 6.5, 6.5, 6.5] : [10, 10, 10, 10]}
                  // widthRatio={LastWidth(1.7, 2.5, 40)}
                />
              </BoxBottomView>
            )}
          </ScrollView>
        </>
      </ListView>
      <Modal
        isVisible={modalPlayVisible}
        onBackdropPress={() => setModalPlayVisible(false)}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          minHeight: Math.round(Dimensions.get("window").height),
        }}
      >
        <StyledPlayModalContainer>
          <BookName>{trimText(bookInfo.title, 25)}</BookName>
          <ModalView>
            <GroupBookBox>
              <ModalView>
                <Image
                  source={{ uri: bookInfo.image }}
                  style={{ flex: 1, marginBottom: 10 }}
                  resizeMode="contain"
                />
              </ModalView>
              <BoxBookView>
                <RowBookGroup>
                  <GroupText>과목 :</GroupText>
                  <RNPickerSelect
                    onValueChange={(value) => {
                      setSubjectId(value)
                    }}
                    items={list}
                    value={subjectId}
                    placeholder={{
                      ...pickerSelectStyles,

                      iconContainer: {
                        top: 0,
                        right: 0,
                      },
                      label: "과목 선택...",
                      value: null,
                      color: "black",
                    }}
                    Icon={() => {
                      return (
                        <Ionicons
                          name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                          size={20}
                          color="gray"
                        />
                      )
                    }}
                  />
                </RowBookGroup>
                <LineView2 />
                <RowBookGroup>
                  <GroupText>페이지 입력</GroupText>
                </RowBookGroup>
                <RowBookGroup>
                  <FlexBox3>
                    <AuthInput
                      {...bookstartInput}
                      placeholder={"시작 페이지"}
                      keyboardType="default"
                      returnKeyType="done"
                      widthRatio={5}
                      // onSubmitEditing={handleLogin}
                      autoCorrect={false}
                    />
                  </FlexBox3>
                  <MainView>
                    <GroupText>~</GroupText>
                  </MainView>
                  <FlexBox3>
                    <AuthInput
                      {...bookendInput}
                      placeholder={"끝 페이지"}
                      keyboardType="default"
                      returnKeyType="done"
                      widthRatio={5}
                      // onSubmitEditing={handleLogin}
                      autoCorrect={false}
                    />
                  </FlexBox3>
                </RowBookGroup>
                <LineView2 />
                <RowBookGroup style={{ marginBottom: 5 }}>
                  <GroupText>평균 1독 소요 시간 / 주</GroupText>
                </RowBookGroup>
                <RowBookGroup style={{ marginBottom: 5 }}>
                  <GroupTimeText>나의 1독 목표</GroupTimeText>
                </RowBookGroup>

                <RowBookGroup2>
                  <FlexBox4>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                      <GroupTimeText2>{selectDay}</GroupTimeText2>
                    </TouchableOpacity>
                  </FlexBox4>
                  <RowBookGroup2 style={{ width: 15 }}>
                    <GroupText2>~</GroupText2>
                  </RowBookGroup2>
                  <FlexBox4>
                    <TouchableOpacity onPress={() => setModalVisible2(!modalVisible2)}>
                      <GroupTimeText2>{selectDay2}</GroupTimeText2>
                    </TouchableOpacity>
                  </FlexBox4>
                </RowBookGroup2>
                <MaginTopView>
                  <AuthButton
                    onPress={() => {
                      onCreateUserBook(bookInfo)
                    }}
                    text="책 입력"
                    color="white"
                    bgColor={"#7BA9EB"}
                    widthRatio={LastWidth(1, 2, 4)}
                  />
                </MaginTopView>
              </BoxBookView>
            </GroupBookBox>
          </ModalView>
        </StyledPlayModalContainer>
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={modalVisible}
          backdropColor={"black"}
          onBackdropPress={() => setModalVisible(false)}
        >
          <Calendar
            current={selectDay}
            minDate={"2012-05-10"}
            maxDate={"2100-05-30"}
            onDayPress={(day) => {
              setSelectDate(new Date(day.timestamp))
              setselectDay(day.dateString)
              setModalVisible(!modalVisible)
            }}
            monthFormat={"yyyy MM"}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={modalVisible2}
          backdropColor={"black"}
          onBackdropPress={() => setModalVisible2(false)}
        >
          <Calendar
            current={selectDay2}
            minDate={"2012-05-10"}
            maxDate={"2100-05-30"}
            onDayPress={(day) => {
              setSelectDate2(new Date(day.timestamp))
              setselectDay2(day.dateString)
              setModalVisible2(!modalVisible2)
            }}
            monthFormat={"yyyy MM"}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
          />
        </Modal>
      </Modal>
    </SafeAreaView>
  )
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
  },
  inputAndroid: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
  },
})
{
  /* <BookAnalysisPresenter
          onRefresh={onRefresh}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          bookList={bookList}
        /> */
}
{
  /* <Container>
       <Header hasTabs>
        <TopView>
          <FlexBox2>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TabNavigation")
              }}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-arrow-round-back" : "md-arrow-round-back"}
                color={"#000000"}
                size={40}
              />
            </TouchableOpacity>
          </FlexBox2>
          <FlexBox>
            {Platform.OS === "ios" ? <MainText>책 검색</MainText> : <MainText2>책 검색</MainText2>}
          </FlexBox>
          <FlexTouchBox onPress={() => {}}></FlexTouchBox>
        </TopView>
      </Header>  */
}
{
  /* <Content> */
}
// <SearchView>
//   <SearchBarView>
//     <AuthInput
//       {...titleInput}
//       placeholder={"교재의 제목 또는 ISBN(-제외)을 입력하세요."}
//       keyboardType="default"
//       returnKeyType="done"
//       widthRatio={1.5}
//       // onSubmitEditing={handleLogin}
//       autoCorrect={false}
//     />
//   </SearchBarView>
//   <SearchButtonView>
//     <AuthButton
//       color="white"
//       onPress={() => {
//         onSearchFuc(feedCount)
//         setDisplay(feedCount)
//       }}
//       text="검색"
//       bgColor={"#4181F7"}
//       widthRatio={LastWidth(1, 2, 3)}
//     />
//   </SearchButtonView>
// </SearchView>

// <BookAnalysisPresenter
//   onRefresh={onRefresh}
//   refreshing={refreshing}
//   setRefreshing={setRefreshing}
//   bookList={bookList}
// />
{
  /* </Content>
    </Container> */
}
