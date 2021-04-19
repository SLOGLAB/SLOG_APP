import React, { useEffect, useState, useRef } from "react"
import { ScrollView, RefreshControl, TouchableOpacity, Image, Dimensions } from "react-native"

import { useQuery } from "@apollo/react-hooks"
import Loader from "../../../components/Loader"

import styled from "styled-components"

import { Calendar } from "react-native-calendars"
import Modal from "react-native-modal"
import WeekRange from "../../../components/Date/WeekRange"
import ObjectCopy from "../../../components/ObjectCopy"
import HourMinCal from "../../../components/HourMinCal"
import StackedGroupBar from "../../../graphs/StackedGroupBar"
import constants from "../../../constants"
import AuthButton from "../../../components/AuthButton"
import LastWidth from "../../../components/LastWidth"
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
const StyledPlayModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  /* 모달창 크기 조절 */
  flex: 0.3;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
`
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
`
const Container = styled.TouchableOpacity`
  /* padding-right: 20px; */
  justify-content: center;
  align-items: center;
  flex: 1;
`
const View = styled.View`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10;
  margin-left: 5;
  margin-right: 5;
`
const CenterView = styled.View`
  justify-content: center;
  align-items: center;
`
const DayView = styled.View`
  background-color: rgba(233, 237, 244, 1);
  margin-top: 10;
`
const Text = styled.Text`
  font-size: 15;
  font-family: "GmarketMedium";
`
const TodayView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: rgba(233, 237, 244, 1);
`
const SubText = styled.Text`
  color: black;
  font-size: 10;
  padding-left: 10;
  margin-top: 10;
  font-family: "GmarketMedium";
`
const IndiviList = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 18;
  width: ${constants.width / 5};
  margin-top: 10;
  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const TextTimestyle = styled.Text`
  font-size: 12;
  color: rgba(15, 76, 130, 1);
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const AvartarView = styled.View`
  /* background-color: rgba(196, 196, 196, 1); */
`
const FollowerName_Text = styled.Text`
  font-size: 9;
  font-family: "GmarketMedium";
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const AvatarView = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  width: ${constants.width / 1};
  background-color: rgba(255, 255, 255, 1);
  flex-wrap: wrap;
  margin-top: 10;
  border-radius: 10;
  flex: 1;
`
const FollowerName_Textred = styled.Text`
  font-size: 9;
  font-family: "GmarketMedium";
  color: rgba(234, 50, 35, 1);
`
let firstTime = 0
let averageTime = 0
let existTime_Array = []
let selfIndex = -1
let myTime = 0
let name = ""
export default ({
  groupData,
  groupRefetch,
  loading,
  navigation,
  myData,
  modlaOutMember,
  setmodlaOutMember,
  onOutMember,
  Groupid,
  search,
}) => {
  var todaydate = new Date().getDate() //Current Date
  var todaymonth = new Date().getMonth() + 1 //Current Month
  var todayyear = new Date().getFullYear() //Current Year
  var targetMonth = String(todaymonth).length === 1 ? "0" + todaymonth : todaymonth
  var targetDay = String(todaydate).length === 1 ? "0" + todaydate : todaydate

  var targetToday = todayyear + "-" + targetMonth + "-" + targetDay

  ///

  const [selectPercent, setSelectPercent] = useState(false)
  const [selectPercent2, setSelectPercent2] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectDate, setSelectDate] = useState(new Date())
  const [nextDate, setNextDate] = useState(new Date())
  const oneDayHours_tmp = Array.from(Array(24).keys())
  const oneDayHours = oneDayHours_tmp.map(String)

  const isFirstRun = useRef(true)
  //
  /////월요일부터 이번주 공부시간///////
  const [selectDay, setselectDay] = useState(targetToday)
  var currentDay = new Date(selectDay)
  var theYear = currentDay.getFullYear()
  var theMonth = currentDay.getMonth()
  var theDate = currentDay.getDate()
  var theDayOfWeek = currentDay.getDay() //요일

  var thisWeek = []
  var thism = []
  var thisd = []
  var thisy = []

  for (var i = 0; i < 7; i++) {
    var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek))
    var yyyy = resultDay.getFullYear()
    var mm = Number(resultDay.getMonth()) + 1
    var dd = resultDay.getDate()

    mm = String(mm).length === 1 ? "0" + mm : mm
    dd = String(dd).length === 1 ? "0" + dd : dd

    thisWeek[i] = yyyy + "-" + mm + "-" + dd
    thisy[i] = yyyy
    thism[i] = mm
    thisd[i] = dd
  }

  //

  const lastDate = new Date(selectDate)
  lastDate.setDate(lastDate.getDate() - 7)
  const { real_weekStart, real_weekEnd } = WeekRange(selectDate)
  const { real_weekStart: real_lastStart, real_weekEnd: real_lastEnd } = WeekRange(lastDate)
  const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // nextDate.setDate(nextDate.getDate() + 1)

  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)

  const [modalVisible, setModalVisible] = useState(false)

  const weekTime_calculate = ({ times }) => {
    // 해당주에 생선된 시간이 있는 인덱스 구하기
    let indexOfWeek = []
    let stackIndex = 0 // 원래 인덱스에서 잘려나간 부분을 추가해주는 변수
    let slicedTimes = ObjectCopy(times)
    while (true) {
      const index_tmp = slicedTimes.findIndex(
        (i) => new Date(i.createdAt) >= real_weekStart && new Date(i.createdAt) < real_weekEnd
      )
      if (index_tmp === -1) {
        break
      } else {
        indexOfWeek.push(index_tmp + stackIndex)
        if (index_tmp === slicedTimes.length - 1) {
          break
        }
      }
      slicedTimes = slicedTimes.slice(index_tmp + 1)
      stackIndex = stackIndex + index_tmp + 1
    }
    let arrayBox = new Array(7).fill(0)
    if (indexOfWeek[0] !== undefined) {
      for (let k = 0; k < indexOfWeek.length; k++) {
        const dayIndex = new Date(times[indexOfWeek[k]].createdAt).getDay()
        arrayBox[dayIndex] = times[indexOfWeek[k]].existTime
      }
    }
    return {
      week_existTime: arrayBox,
    }
  }
  const statisticsCal = () => {
    // 1등 시간 계산
    firstTime = existTime_Array.reduce(function (a, b) {
      return Math.max(a, b)
    })
    // 평균 시간 계산
    const timeSum = existTime_Array.reduce((a, b) => a + b, 0)
    averageTime = timeSum / existTime_Array.length
    // 나의 시간 있으면 추가
    const checkSelf = (a) => a.isSelf === true
    selfIndex = groupData.member.findIndex(checkSelf)
    myTime = selfIndex === -1 ? 0 : existTime_Array[selfIndex]
  }

  // 맴버 개별 데이터 계산
  if (!loading) {
    existTime_Array = [] // 시간모음 초기화
    for (let i = 0; i < groupData.member.length; i++) {
      // 학습 시간 초단위
      let total_existTime = 0
      const nowMember = groupData.member[i]

      const { week_existTime } = weekTime_calculate({
        times: nowMember.times,
      })
      total_existTime = week_existTime.reduce((a, b) => a + b, 0)

      // 학습시간을 누적 배열 그리고 member 데이터에 추가
      existTime_Array.push(total_existTime)
      groupData.member[i].total_existTime = total_existTime
      // 시간 단위 계산
      const { hourTime, minTime } = HourMinCal(total_existTime)
      groupData.member[i].total_hour = hourTime
      groupData.member[i].total_min = minTime
      // 매니저인지 판단
      groupData.member[i].isManager = groupData.manager.id === nowMember.id

      if (i === groupData.member.length - 1) {
        statisticsCal() //통계치 계산
        // 학습시간 많은 순서 정렬
        groupData.member.sort(function (a, b) {
          return b.total_existTime - a.total_existTime
        })
      }
    }
  }
  //
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      nextDate.setDate(new Date().getDate() + 1)
      return
    }
    nextDate.setTime(selectDate.getTime())
    nextDate.setDate(nextDate.getDate() + 1)
  }, [selectDate])

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await groupRefetch()
    } catch (e) {
      console.log(e)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    // <TodayView />
    <ScrollView
      style={{ backgroundColor: "#E9EDF4" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: "#E9EDF4" }}
        />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <DayView>
          <TodayView>
            {search ? null : (
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Text>
                  {thisy[0]}.{thism[0]}.{thisd[0]}~{thisy[6]}.{thism[6]}.{thisd[6]}
                </Text>
              </TouchableOpacity>
            )}
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
                maxDate={"2050-05-30"}
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
          </TodayView>
          <View>
            <CenterView>
              {search && myTime == 0 ? (
                <StackedGroupBar
                  data_1={[averageTime / 60, firstTime / 60]}
                  labels={["평균 시간", "1등 시간"]}
                  data_2={["#8DE4AB", "#EA3223"]}
                  label_1={"학습"}
                  label_2={"목표"}
                  title={"과목별 학습 시간"}
                  title_x={"시간(분)"}
                  stepSize_x={60}
                />
              ) : (
                <StackedGroupBar
                  data_1={[averageTime / 60, myTime / 60, firstTime / 60]}
                  labels={["평균 시간", "나의 시간", "1등 시간"]}
                  data_2={["#8DE4AB", "#58A0F5", "#EA3223"]}
                  label_1={"학습"}
                  label_2={"목표"}
                  title={"과목별 학습 시간"}
                  title_x={"시간(분)"}
                  stepSize_x={60}
                />
              )}
            </CenterView>
          </View>
          <AvatarView>
            {groupData.member.map((list, index) => (
              <IndiviList key={index}>
                <TextTimestyle>
                  {list.total_hour.length === 1 ? "0" + list.total_hour : list.total_hour} :{" "}
                  {list.total_min.length === 1 ? "0" + list.total_min : list.total_min}{" "}
                </TextTimestyle>
                <AvartarView>
                  <TouchableOpacity
                    onPress={() => {
                      if (list.username !== myData.username) {
                        name = list.username
                        setmodlaOutMember(!modlaOutMember)
                      }
                    }}
                  >
                    <Image
                      style={{
                        height: HEIGHT / 15,
                        width: HEIGHT / 15,
                        borderRadius: 30,
                        marginTop: 0,
                        marginBottom: 0,
                        borderWidth: 4.5,

                        borderColor: list.existToggle
                          ? "rgba(107, 152, 247, 1)"
                          : "rgba(133, 133, 133, 1)",
                      }}
                      source={{ uri: list.avatar }}
                    />
                  </TouchableOpacity>
                </AvartarView>
                <FollowerName_Text>
                  {list.username.length > 6 ? list.username.substr(0, 5) + ".." : list.username}
                </FollowerName_Text>
                {groupData.manager.username == list.username ? (
                  <FollowerName_Textred>(방장)</FollowerName_Textred>
                ) : null}
                <Modal
                  isVisible={modlaOutMember}
                  onBackdropPress={() => setmodlaOutMember(false)}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <StyledPlayModalContainer>
                    <ModalView>
                      <Container>
                        {groupData.imManager ? (
                          <>
                            <AuthButton
                              onPress={() => {
                                navigation.navigate("Userdetail", {
                                  username: name,
                                  myname: myData.username,
                                  bool: true,
                                })
                                setmodlaOutMember(false)
                              }}
                              text="프로필 이동"
                              color="white"
                              bgColor={"#7BA9EB"}
                              widthRatio={LastWidth(1, 2, 10)}
                            />

                            <StyledPlayModalContainer />
                            <AuthButton
                              onPress={() => {
                                onOutMember(Groupid, list.id)
                              }}
                              text="추방"
                              color="white"
                              bgColor={"#7BA9EB"}
                              widthRatio={LastWidth(1, 2, 10)}
                            />
                          </>
                        ) : (
                          <AuthButton
                            onPress={() => {
                              navigation.navigate("Userdetail", {
                                username: name,
                                myname: myData.username,
                                bool: true,
                              })
                              setmodlaOutMember(false)
                            }}
                            text="프로필 이동"
                            color="white"
                            bgColor={"#7BA9EB"}
                            widthRatio={LastWidth(1, 2, 10)}
                          />
                        )}
                      </Container>
                    </ModalView>
                  </StyledPlayModalContainer>
                </Modal>
              </IndiviList>
            ))}
          </AvatarView>
        </DayView>
      )}
    </ScrollView>
  )
}
// targetTime1={targetTime1}
// targetTime2={targetTime2}
// targetTime3={targetTime3}
// targetTime4={targetTime4}
// targetTime5={targetTime5}
// targetTime6={targetTime6}
// targetTime7={targetTime7}

// console.log(existData)
// const timeNumber = async () => {
//   for (j = 0; j < 7; j++) {
//     weekTimeArray.push(
//       existData.findIndex((i) => moment(i.createdAt).format("YYYY-MM-DD") === thisWeek[j])
//     )
//   }
//   if (weekTimeArray[0] === -1) {
//     setExistTime1(0)
//   } else {
//     setExistTime1(existData[weekTimeArray[0]].existTime)
//   }
//   if (weekTimeArray[1] === -1) {
//     setExistTime2(0)
//   } else {
//     setExistTime2(existData[weekTimeArray[1]].existTime)
//   }
//   if (weekTimeArray[2] === -1) {
//     setExistTime3(0)
//   } else {
//     setExistTime3(existData[weekTimeArray[2]].existTime)
//   }
//   if (weekTimeArray[3] === -1) {
//     setExistTime4(0)
//   } else {
//     setExistTime4(existData[weekTimeArray[3]].existTime)
//   }
//   if (weekTimeArray[4] === -1) {
//     setExistTime5(0)
//   } else {
//     setExistTime5(existData[weekTimeArray[4]].existTime)
//   }
//   if (weekTimeArray[5] === -1) {
//     setExistTime6(0)
//   } else {
//     setExistTime6(existData[weekTimeArray[5]].existTime)
//   }
//   if (weekTimeArray[6] === -1) {
//     setExistTime7(0)
//   } else {
//     setExistTime7(existData[weekTimeArray[6]].existTime)
//   }
// }

// const setTargetTimeSun = async () => {
//   targetArraySun.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[0])
//   )
//   targetArrayMon.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[1])
//   )
//   targetArrayTue.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[2])
//   )
//   targetArrayWed.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[3])
//   )
//   targetArrayThu.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[4])
//   )
//   targetArrayFri.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[5])
//   )
//   targetArraySat.push(
//     scheduleData.me.schedules.filter((i) => moment(i.start).format("YYYY-MM-DD") === thisWeek[6])
//   )
// }
// const sumExistTimeSun = () => {
//   if (targetArraySun[0][0] !== undefined) {
//     for (i = 0; i < targetArraySun[0].length; i++) {
//       targetHourSun.push(
//         (moment(targetArraySun[0][i].end).format("HH") -
//           moment(targetArraySun[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArraySun[0][i].end).format("mm") -
//             moment(targetArraySun[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime1(SumArray(targetHourSun))
//     }
//   } else {
//     setTargetTime1(0)
//   }
//   if (targetArrayMon[0][0] !== undefined) {
//     for (i = 0; i < targetArrayMon[0].length; i++) {
//       targetHourMon.push(
//         (moment(targetArrayMon[0][i].end).format("HH") -
//           moment(targetArrayMon[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayMon[0][i].end).format("mm") -
//             moment(targetArrayMon[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime2(SumArray(targetHourMon))
//     }
//   } else {
//     setTargetTime2(0)
//   }
//   if (targetArrayTue[0][0] !== undefined) {
//     for (i = 0; i < targetArrayTue[0].length; i++) {
//       targetHourTue.push(
//         (moment(targetArrayTue[0][i].end).format("HH") -
//           moment(targetArrayTue[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayTue[0][i].end).format("mm") -
//             moment(targetArrayTue[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime3(SumArray(targetHourTue))
//     }
//   } else {
//     setTargetTime3(0)
//   }

//   if (targetArrayWed[0][0] !== undefined) {
//     for (i = 0; i < targetArrayWed[0].length; i++) {
//       targetHourWed.push(
//         (moment(targetArrayWed[0][i].end).format("HH") -
//           moment(targetArrayWed[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayWed[0][i].end).format("mm") -
//             moment(targetArrayWed[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime4(SumArray(targetHourWed))
//     }
//   } else {
//     setTargetTime4(0)
//   }
//   if (targetArrayThu[0][0] !== undefined) {
//     for (i = 0; i < targetArrayThu[0].length; i++) {
//       targetHourThu.push(
//         (moment(targetArrayThu[0][i].end).format("HH") -
//           moment(targetArrayThu[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayThu[0][i].end).format("mm") -
//             moment(targetArrayThu[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime5(SumArray(targetHourThu))
//     }
//   } else {
//     setTargetTime5(0)
//   }
//   if (targetArrayFri[0][0] !== undefined) {
//     for (i = 0; i < targetArrayFri[0].length; i++) {
//       targetHourFri.push(
//         (moment(targetArrayFri[0][i].end).format("HH") -
//           moment(targetArrayFri[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArrayFri[0][i].end).format("mm") -
//             moment(targetArrayFri[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime6(SumArray(targetHourFri))
//     }
//   } else {
//     setTargetTime6(0)
//   }
//   if (targetArraySat[0][0] !== undefined) {
//     for (i = 0; i < targetArraySat[0].length; i++) {
//       targetHourSat.push(
//         (moment(targetArraySat[0][i].end).format("HH") -
//           moment(targetArraySat[0][i].start).format("HH")) *
//           3600 +
//           (moment(targetArraySat[0][i].end).format("mm") -
//             moment(targetArraySat[0][i].start).format("mm")) *
//             60
//       )
//       setTargetTime7(SumArray(targetHourSat))
//     }
//   } else {
//     setTargetTime7(0)
//   }
// }
