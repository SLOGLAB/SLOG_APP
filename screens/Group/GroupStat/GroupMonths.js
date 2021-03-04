import React, { useState } from "react"
import styled from "styled-components"
import { TouchableOpacity, Image, Dimensions } from "react-native"
import { Calendar } from "react-native-calendars"
import Modal from "react-native-modal"
import ObjectCopy from "../../../components/ObjectCopy"
import HourMinCal from "../../../components/HourMinCal"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

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
  flex: 1;
  width: ${WIDTH / 6.5};
  /* background-color: ${(props) => (props.isOdd ? "#FAFAFA" : "#c7c7c7")}; */
`
const TextTimestyle = styled.Text`
  font-size: 12;
  color: rgba(15, 76, 130, 1);
  font-family: "GmarketMedium";

  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const AvartarView = styled.View`
  flex: 0.75;
  /* background-color: rgba(196, 196, 196, 1); */
`
const FollowerName_Text = styled.Text`
  font-size: 9;
  font-family: "GmarketMedium";
  /* border-color: ${(props) => (props.isOdd ? "#c7c7c7" : "#FAFAFA")}; */
`
const AvatarView = styled.View`
  height: ${HEIGHT / 8};
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
`
let firstTime = 0
let averageTime = 0
let existTime_Array = []
let selfIndex = -1
let myTime = 0
const GroupMonths = ({
  myData,
  groupData,
  onRefresh,
  selectDate,
  nextDate,
  setSelectDate,
  oneDayHours,
  loading,
  targetToday,
  selectPercent,
  setSelectPercent,
  selectPercent2,
  setSelectPercent2,
  navigation,
}) => {
  const [selectDay, setselectDay] = useState(targetToday)
  const myState = myData.studyPurpose === "학습" ? ["자습", "강의"] : ["업무", "개인"]

  var now = new Date(selectDay)
  var theYear = now.getFullYear()
  var theMonth = now.getMonth() + 1
  var thisMonthDays
  thisMonthDays = new Date(theYear, theMonth, 0).getDate() //이번달 일 수

  var thisMonth = []
  var thisy = []
  var thism = []
  var thisd = []
  for (var i = 1; i < thisMonthDays + 1; i++) {
    var resultDay = new Date(theYear, theMonth, i)
    var yyyy = resultDay.getFullYear()
    var mm = Number(resultDay.getMonth())
    var dd = resultDay.getDate()

    mm = String(mm).length === 1 ? "0" + mm : mm
    dd = String(dd).length === 1 ? "0" + dd : dd

    thisMonth[i] = yyyy + "-" + mm + "-" + dd
    thisy[i] = yyyy
    thism[i] = mm
    thisd[i] = dd
  }

  //
  const scheduleList = myData.schedules
  // const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // // // daysOfMonth Area차트의 x축 라벨 변수
  // const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  // const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  // const daysOfMonth = daysOfMonth_number.map(String)
  const lastMonthDate = new Date(selectDate)
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
  const selectMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(selectMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)

  const [modalVisible, setModalVisible] = useState(false)

  const monthTime_calculate = ({ times }) => {
    // 이번달에 생선된 시간이 있는 인덱스 구하기 & time 뽑기
    let indexOfMonth = []
    let stackIndex = 0 // 원래 인덱스에서 잘려나간 부분을 추가해주는 변수
    let slicedTimes = ObjectCopy(times)
    while (true) {
      const index_tmp = slicedTimes.findIndex(
        (i) =>
          new Date(i.createdAt).getFullYear() === selectDate.getFullYear() &&
          new Date(i.createdAt).getMonth() === selectDate.getMonth()
      )
      if (index_tmp === -1) {
        break
      } else {
        indexOfMonth.push(index_tmp + stackIndex)
        if (index_tmp === slicedTimes.length - 1) {
          break
        }
      }
      slicedTimes = slicedTimes.slice(index_tmp + 1)
      stackIndex = stackIndex + index_tmp + 1
    }
    let arrayBox = new Array(selectMonthDate).fill(0)
    if (indexOfMonth[0] !== undefined) {
      for (let k = 0; k < indexOfMonth.length; k++) {
        const dateIndex = new Date(times[indexOfMonth[k]].createdAt).getDate() - 1
        arrayBox[dateIndex] = times[indexOfMonth[k]].existTime
      }
    }
    return {
      month_existTime: arrayBox,
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

      const { month_existTime } = monthTime_calculate({
        times: nowMember.times,
      })
      total_existTime = month_existTime.reduce((a, b) => a + b, 0)

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
  return (
    <DayView>
      <TodayView>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text>{selectDay}</Text>
        </TouchableOpacity>
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
          <SubText>1등 시간:{firstTime}초</SubText>
          <SubText>평균 시간: {averageTime}초</SubText>
          <SubText>나의 시간: {myTime}초</SubText>
          <SubText>그룹 최소 학습 시간: {groupData.targetTime}시간</SubText>
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
                onPress={() =>
                  navigation.navigate("Userdetail", {
                    username: list.username,
                    myname: myData.username,
                  })
                }
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
          </IndiviList>
        ))}
      </AvatarView>
    </DayView>
  )
}
export default GroupMonths
