import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {
  Image,
  Platform,
  View,
  Dimensions,
  ScrollView,
  RefreshControl,
  AppRegistry,
  StyleSheet,
  Text,
} from "react-native"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLabel,
  VictoryTheme,
} from "victory-native"
import AuthButton from "../../components/AuthButton"
import AuthInput from "../../components/AuthInput"
import useInput from "../../hooks/useInput"

import LastWidth from "../../components/LastWidth"
import Modal from "react-native-modal"
import Icon from "../../components/Icon"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Slider } from "@miblanchard/react-native-slider"
import { Calendar } from "react-native-calendars"
import WeekRange from "../../components/WeekRange"
import SumArray from "../../components/SumArray"
import { useMutation } from "@apollo/react-hooks"
import { CREATE_CLEARRECORD } from "./MyStudyQueries"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

const GroupBox = styled.View`
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
const BookButton = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const BookText = styled.Text``
const ContentsView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const ContentsSubView = styled.View``
const ContentsSubView1 = styled.View`
  flex-direction: row;
  align-items: center;
`
const CircleView = styled.View`
  margin-left: 5;
  width: 22;
  height: 22;
  border-radius: 20;
  border-width: 1;
  justify-content: center;
  align-items: center;
`

const CoText = styled.Text`
  color: black;
  font-size: 20;
  font-weight: normal;
  font-family: "GmarketMedium";
`

const IndiviList1 = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding-left: 10;
  padding-right: 10;
  flex: 1;
  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.65;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const StyledModalSetContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.3;
  width: 80%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
`

const ModalSubView = styled.View`
  flex: 0.15;
  align-items: center;
  justify-content: center;
`
const ModalSubView2 = styled.View`
  flex: 0.8;
  width: ${WIDTH / 1.15};
`

const LineView = styled.View`
  width: ${WIDTH / 1.4};
  height: 2px;
  color: #000;
`
const CenterView = styled.View`
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  /* background-color: rgba(0, 0, 0, 1); */
  /* position: absolute; */
  /* margin-top: 90; */
  height: 65;
`
const CenterBookView = styled.View`
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  flex-direction: row;
  flex: 0.5;
  /* background-color: rgba(0, 0, 0, 1); */
  /* position: absolute; */
  /* margin-top: 90; */
`
const ClearText1 = styled.Text`
  color: green;
  font-size: 15;
  font-weight: normal;
  font-family: "GmarketMedium";
`
const ClearText2 = styled.Text`
  color: red;
  font-size: 15;
  font-weight: normal;
  font-family: "GmarketMedium";
`
const EmptyView = styled.View``
export default ({
  onebook,
  delayDay,
  nowDate,
  real_weekEnd,
  uesrbookRefetch,
  // onCreateRecord,
  // startPage,
  // endPage,
  // finishDate,
  // setFinishDate,
}) => {
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [selectDay2, setselectDay2] = useState(targetToday)
  const [selectDate2, setSelectDate2] = useState(new Date())

  const [modalSetVisible, setModalSetVisible] = useState(false)
  const [value, setValue] = useState(0)
  const [upDown, setUpDown] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const BookStartInput = useInput(0)
  const BookEndInput = useInput(value)

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      //   await myInfoRefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }

  //진도설정창 페이지 설정 Api
  // const SliderContainer = (caption, children, sliderValue, trackMarks) => {
  //   const [value, setValue] = useState(!!sliderValue ? sliderValue : DEFAULT_VALUE)

  //   let renderTrackMarkComponent
  //   if (trackMarks?.length) {
  //     renderTrackMarkComponent = (index) => {
  //       const currentMarkValue = trackMarks[index]
  //       const style =
  //         currentMarkValue > Math.max(value)
  //           ? trackMarkStyles.activeMark
  //           : trackMarkStyles.inactiveMark
  //       return <View style={style} />
  //     }
  //   }

  //   const renderChildren = () => {
  //     return Children.map(children, (child) => {
  //       if (!!child && child.type === Slider) {
  //         return cloneElement(child, {
  //           onValueChange: setValue,
  //           renderTrackMarkComponent,
  //           trackMarks,
  //           value,
  //         })
  //       }
  //       return child
  //     })
  //   }
  //   return (
  //     <View style={styles.sliderContainer}>
  //       <View style={styles.titleContainer}>
  //         <Text>{caption}</Text>
  //         <Text>{Array.isArray(value) ? value.join(" - ") : value}</Text>
  //       </View>
  //       {renderChildren()}
  //     </View>
  //   )
  // }

  function replaceRobotoWithSystemFont(obj) {
    const keys = Object.keys(obj)
    keys.forEach(function (key) {
      const value = obj[key]
      if (key === "fontFamily") {
        obj[key] = obj[key].replace("'Roboto',", "'System',")
      }
      if (typeof value === "object") {
        replaceRobotoWithSystemFont(obj[key])
      }
    })
    return obj
  }

  const themeWithSystemFont = replaceRobotoWithSystemFont({ ...VictoryTheme.material })
  //////////////////
  // 이번주에 날짜인지 검증
  const isthisWeekCal = (inputDate) => {
    const refDate = new Date(inputDate)
    const { real_weekStart, real_weekEnd } = WeekRange(new Date()) // 해당 주의 시작과 끝
    return refDate >= real_weekStart && refDate < real_weekEnd
  }

  let inputData = [] // 그래프에 넣을 최종 데이터
  const records = onebook.clearRecords

  // 해당 교제의 시작 페이지가 혹시 1보다 크면 앞에 부분은 빈공간으로 채워줌
  if (onebook.startPage_target > 1) {
    inputData.push({
      backgroundColor: "white",
      data: [onebook.startPage_target - 1],
    })
  }

  let nextIndex = 0 // 작업해야할 record 인덱스
  let nextStartPage = onebook.startPage_target // 작업할 다음 시작 페이지
  const emptyArray = [] // 빈공간 데이터 인덱스 모음
  while (true) {
    // 작업(추가)할 record가 남았는지?
    if (records.length > nextIndex) {
      //남은 시작페이지가 다음 record에 포함안되면 앞에 공백 채워줘야됨
      if (nextStartPage !== records[nextIndex].startPage) {
        // 다음 기록 시작 전까지 공백 넣어주기
        emptyArray.push(inputData.length) // 공백 넣을 인덱스 기록
        inputData.push({
          backgroundColor: "white",
          data: [records[nextIndex].startPage - nextStartPage],
          clearDate: new Date("December 17, 1995 03:24:00"), // 공백이니까 옛날 임의 데이터넣기
        })
        nextStartPage += records[nextIndex].startPage - nextStartPage
      }
      // 기록 넣어주기
      const amount = records[nextIndex].totalPage
      const isThisWeek = isthisWeekCal(records[nextIndex].clearDate) //이번주 기록인지
      inputData.push({
        backgroundColor: isThisWeek ? "#7AC6FC" : "#008EFC",
        data: [amount],
        clearDate: new Date(records[nextIndex].clearDate),
      })
      nextIndex += 1
      nextStartPage += amount
    } else {
      // 다음 시작 지점이 책 끝을 넘는지 (넘으면 빈공간이 없는거)
      if (nextStartPage > onebook.endPage_target) {
        break
      } else {
        //마지막 부분까지 공백 넣기
        emptyArray.push(inputData.length) // 공백 넣을 인덱스 기록
        inputData.push({
          backgroundColor: "white",
          data: [onebook.endPage_target - nextStartPage + 1],
          clearDate: new Date("December 17, 1995 03:24:00"), // 공백이니까 옛날 임의 데이터넣기
        })
        break
      }
    }
  }

  // 이번주 남은 목표양 계산
  // 빈공간이 없으면 이번주 남은 목표를 계산할 필요가 없음
  if (emptyArray.length !== 0) {
    let thisWeekPage = 0 // 이번주 할당 총페이지
    if (isthisWeekCal(onebook.startDate_target)) {
      // 교재학습 시작이 이번주에 걸치는지
      const startDate = new Date(onebook.startDate_target)
      const studyDay = 7 - startDate.getDay() // 이번주에 몇일 공부해야하는지
      thisWeekPage = studyDay * onebook.pageOfDay
    } else if (isthisWeekCal(onebook.endDate_target)) {
      // 교재학습 끝이 이번주에 걸치는지
      const endDate = new Date(onebook.endDate_target)
      const studyDay = 7 - endDate.getDay() // 이번주에 몇일 공부해야하는지
      thisWeekPage = studyDay * onebook.pageOfDay
    } else {
      const studyDay = 7 // 이번주에 몇일 공부해야하는지
      thisWeekPage = studyDay * onebook.pageOfDay
    }
    thisWeekPage = Math.ceil(thisWeekPage) // 소숫점 올림

    // 이번주에 이미 학습한 페이지 수를 알기위해 이번주 기록 추출
    const thisWeekRecords = inputData.filter((a) => a.backgroundColor === "#7AC6FC")
    let clearPage = 0 // 이번주 완료한 페이지
    thisWeekRecords.map((record) => {
      clearPage += record.data[0]
    })
    let remainPage = thisWeekPage - clearPage //이번주에 남은 할당량 페이지
    // 이번주 남은 할당량이 없으면 목표치 기록 필요 없음
    if (remainPage > 1) {
      // 가장 최근에 학습한 기록 찾기
      const lastDate = Math.max(...inputData.map((data) => data.clearDate))
      // inputData에서 최근 학습 기록 인덱스 찾기
      const lastIndex = inputData.findIndex((data) => data.clearDate.getTime() === lastDate)
      // 빈공간 인덱스 저장 배열을 최신 학습 기록 뒤로 부터 순서대로 재정렬
      const firstIndex = emptyArray.findIndex((a) => a > lastIndex)
      let emptyArray2 = []
      if (firstIndex > 0) {
        emptyArray2 = emptyArray.slice(firstIndex)
        emptyArray2.push(...emptyArray.slice(0, firstIndex))
      } else {
        // 최신 바로 뒤에오는 빈데이터가 맨 앞이거나 없으면 재배열 필요x
        emptyArray2 = emptyArray
      }
      // 빈공간 개수만큼 탐색해서 남은 목표 채워나가기
      for (var j = 0; j < emptyArray2.length; j++) {
        const nowData = inputData[emptyArray2[j]]
        // 해당 빈공간 빼고 앞뒤로 자르기
        const frontData = inputData.slice(0, emptyArray2[j])
        const backData = inputData.slice(emptyArray2[j] + 1)
        if (nowData.data[0] > remainPage) {
          const midData = [
            {
              backgroundColor: "#D6EEFF",
              data: [remainPage],
            },
            {
              backgroundColor: "white",
              data: [nowData.data[0] - remainPage],
            },
          ]
          inputData = [...frontData, ...midData, ...backData]
          break
        } else {
          const midData = [
            {
              backgroundColor: "#D6EEFF",
              data: [nowData.data[0]],
            },
          ]
          inputData = [...frontData, ...midData, ...backData]
          // 빈공간 크기와 목표가 완전 똑같으면 또 for loop 돌필요가 없음
          if (nowData.data[0] === remainPage) {
            break
          }
          remainPage = remainPage - nowData.data[0]
        }
      }
    }
  }
  // 주간 목표 계산
  let frontPage = onebook.startPage_target
  let backPage = onebook.startPage_target - 1
  const thisWeekFinish = []
  const thisWeekTarget = []
  for (var i = 0; i < inputData.length; i++) {
    frontPage = backPage + 1
    backPage = frontPage + inputData[i].data[0] - 1
    if (inputData[i].backgroundColor === "#7AC6FC") {
      //이번주 완료인지
      thisWeekFinish.push(`${frontPage}~${backPage}`)
    } else if (inputData[i].backgroundColor === "#D6EEFF") {
      // 이번주 목표인지
      thisWeekTarget.push(`${frontPage}~${backPage}`)
    }
  }

  const [finishDate, setFinishDate] = useState(new Date())

  const positive = (value) => value >= 0

  const startPage = useInput(1, positive)
  const endPage = useInput(10, positive)
  const [createClearRecordMutation] = useMutation(CREATE_CLEARRECORD)

  const onCreateRecord = async (userbook) => {
    // e.preventDefault();
    if (startPage.value < userbook.startPage_target || endPage.value > userbook.endPage_target) {
      Alert.alert(
        `입력한 페이지가 교재 학습 범위인 ${userbook.startPage_target}~${userbook.endPage_target}페이지를 벗어납니다.`
      )
      return
    }

    try {
      const {
        data: { createClearRecord },
      } = await createClearRecordMutation({
        variables: {
          startPage: Number(startPage.value),
          endPage: Number(endPage.value),
          userBookId: userbook.id,
          clearDate: finishDate,
        },
      })
      if (!createClearRecord) {
        Alert.alert("교재 진도를 입력할 수 없습니다.")
      } else {
        uesrbookRefetch()
        Alert.alert("교재 진도 입력이 완료됐습니다.")
        setModalSetVisible(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  let inputSumData = [] //
  let sum = 0
  for (let i = 0; i < inputData.length; i++) {
    for (let j = 0; j < i + 1; j++) {
      sum = sum + inputData[j].data[0]
    }
    inputSumData.push({ sum: sum, one: inputData[i].data[0] })
    sum = 0
  }
  useEffect(() => {}, [])
  return (
    <>
      <GroupBox>
        <Image
          source={{
            uri: onebook.image,
          }}
          style={{ flex: 1 }}
          resizeMode="contain"
        />
        <BoxView>
          <ContentsView>
            <ContentsSubView1>
              <BookText>주간목표</BookText>
              <CircleView>
                <TouchableOpacity
                  onPress={() => {
                    // setModalVisible(!modalVisible)
                    setUpDown(!upDown)
                  }}
                >
                  {upDown ? (
                    <Icon
                      name={Platform.OS === "ios" ? "ios-arrow-up" : "md-arrow-up"}
                      color={"rgba(0,0,0, 1)"}
                      size={20}
                    />
                  ) : (
                    <Icon
                      name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-down"}
                      color={"rgba(0,0,0, 1)"}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              </CircleView>
            </ContentsSubView1>
          </ContentsView>
          <ContentsView>
            {!upDown ? (
              <ContentsSubView>
                {thisWeekFinish.map((data, index) => (
                  <BookText key={index}>{data} </BookText>
                ))}
                {thisWeekTarget.map((data, index) => (
                  <BookText key={index}>{data} </BookText>
                ))}
              </ContentsSubView>
            ) : (
              <ContentsSubView></ContentsSubView>
            )}
            <ContentsSubView>
              <AuthButton
                //loading={loading}
                onPress={() => {
                  setModalSetVisible(true)
                }}
                bgColor={"#4181F7"}
                text="진도입력"
                color="white"
                widthRatio={LastWidth(1, 2, 3.5)}
              />
              <ContentsSubView1>
                <BookText>clear day</BookText>
                <ContentsSubView>
                  {/* <ClearText1>-3</ClearText1>
                  <ClearText2>+10</ClearText2> */}
                  {nowDate >= real_weekEnd ? (
                    <ClearText1>(목표 주 초과)</ClearText1>
                  ) : (
                    <ClearText2>
                      ({delayDay > 0 && "+"}
                      {delayDay})
                    </ClearText2>
                  )}
                </ContentsSubView>
              </ContentsSubView1>
            </ContentsSubView>
          </ContentsView>
          {/* <ContentsView>
            <VictoryChart height={40} width={300} domainPadding={{ x: 0, y: 0 }}>
              <VictoryStack colorScale={["red", "blue", "tomato"]} style={{ data: { width: 10 } }}>
                <VictoryBar horizontal data={[{ x: "a", y: 2 }]} />
                <VictoryBar horizontal data={[{ x: "a", y: 2 }]} />
                <VictoryBar horizontal data={[{ x: "a", y: 3 }]} />
              </VictoryStack>
              <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}%`} />
              <VictoryAxis tickFormat={["a"]} />
            </VictoryChart>
            <BookText>주간목표</BookText>
          </ContentsView> */}
        </BoxView>

        {/* 목차자세히 */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => {
            setModalVisible(false)
            setUpDown(!upDown)
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
          <StyledModalContainer>
            <ModalView>
              <ModalSubView>
                <CoText>목차</CoText>
              </ModalSubView>
              <LineView />
              <ModalSubView2>
                <ScrollView
                  style={{ backgroundColor: "#ffffff" }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      style={{ backgroundColor: "#ffffff" }}
                    />
                  }
                >
                  {/* {myData.following.map((list) => (
                
                ))} */}
                </ScrollView>
                <IndiviList1>
                  <AuthButton
                    onPress={() => {
                      setModalVisible(false)
                      setUpDown(!upDown)
                    }}
                    text="닫기"
                    color="white"
                    bgColor={"#7BA9EB"}
                    widthRatio={LastWidth(1, 2, 18)}
                  />
                </IndiviList1>
              </ModalSubView2>
            </ModalView>
          </StyledModalContainer>
        </Modal>
        {/* 진도설정 */}
        <Modal
          isVisible={modalSetVisible}
          onBackdropPress={() => setModalSetVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: Math.round(Dimensions.get("window").height),
          }}
        >
          <StyledModalSetContainer>
            <ModalView>
              {/* <ModalSubView>
                <CoText>진도 입력</CoText>
              </ModalSubView>
              <LineView /> */}

              <ModalSubView>
                <TouchableOpacity onPress={() => setModalVisible2(!modalVisible2)}>
                  <BookText>{selectDay2}</BookText>
                </TouchableOpacity>
              </ModalSubView>
              <CenterBookView>
                <BookButton>
                  <AuthInput
                    {...startPage}
                    placeholder={"시작페이지"}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    // onSubmitEditing={handleLogin}
                    autoCorrect={false}
                    widthRatio={4}
                  />
                </BookButton>
                <BookButton>
                  <AuthInput
                    {...endPage}
                    placeholder={"끝 페이지"}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    // onSubmitEditing={handleLogin}
                    autoCorrect={false}
                    widthRatio={4}
                  />
                </BookButton>
              </CenterBookView>

              {/* <Slider
                  value={BookEndInput.value}
                  onValueChange={(value) => setValue(value)}
                  maximumTrackTintColor="#d3d3d3"
                  maximumValue={200}
                  minimumTrackTintColor="#4181F7"
                  minimumValue={0}
                  step={1}
                  thumbStyle={customStyles3.thumb}
                  trackStyle={customStyles3.track}
                />

                <Slider
                  animateTransition
                  value={[6, 8]}
                  maximumTrackTintColor="#d3d3d3"
                  maximumValue={20}
                  minimumTrackTintColor="#1fb28a"
                  minimumValue={4}
                  step={1}
                  thumbTintColor="#1a9274"
                /> */}
              {/* <CenterView>
                  <BookText>Page: {value}</BookText>
                </CenterView> */}
              {/* </ScrollView> */}
              <IndiviList1>
                {/* <AuthButton
                    onPress={() => {
                      setModalSetVisible(false)
                    }}
                    text="닫기"
                    color="white"
                    bgColor={"#7BA9EB"}
                    widthRatio={LastWidth(1, 2, 5)}
                  /> */}
                <AuthButton
                  onPress={() => {
                    onCreateRecord(onebook)
                  }}
                  text="입력"
                  color="white"
                  bgColor={"#7BA9EB"}
                  widthRatio={LastWidth(1, 2, 5)}
                />
              </IndiviList1>
            </ModalView>
          </StyledModalSetContainer>
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
                setFinishDate(new Date(day.timestamp))
              }}
              monthFormat={"yyyy MM"}
              onPressArrowLeft={(subtractMonth) => subtractMonth()}
              onPressArrowRight={(addMonth) => addMonth()}
            />
          </Modal>
        </Modal>
      </GroupBox>
      <CenterView>
        <VictoryChart
          height={110}
          width={Dimensions.get("window").width + 50}
          domainPadding={{ x: 0, y: 0 }}
          theme={themeWithSystemFont}
        >
          <VictoryStack
            //    colorScale={["red", "blue", "tomato"]}
            style={{ data: { width: 10 } }}
          >
            {inputData.map((onebook, index) => (
              <VictoryBar
                horizontal
                data={[{ x: "", y: onebook.data[0] }]}
                color={onebook.backgroundColor}
                // labels={onebook.data[0]}
                // labelComponent={<VictoryLabel dy={0} dx={0} />}
              />
            ))}
          </VictoryStack>
          {inputSumData.map((onebook, index) => (
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => onebook.one}
              tickValues={[onebook.sum]}
              theme={themeWithSystemFont}
              style={{ tickLabels: { fill: "#1FB28A" } }}
              // orientation="top"
            />
          ))}
          {/* <VictoryAxis
            dependentAxis
            tickFormat={(tick) => "plan"}
            tickValues={[inputData[0].data[0]]}
            theme={themeWithSystemFont}
            style={{ tickLabels: { fill: "#1FB28A" } }}
            // orientation="top"
          /> */}

          {/* <VictoryAxis tickFormat={[""]} minDomain={{ x: 0 }} /> */}
        </VictoryChart>
      </CenterView>
    </>
  )
}
const customStyles3 = StyleSheet.create({
  thumb: {
    backgroundColor: "#000000",
    borderRadius: 5,
    height: 30,
    width: 10,
  },
  track: {
    backgroundColor: "#d0d0d0",
    borderRadius: 5,
    height: 10,
  },
})
