import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { TouchableOpacity, Image, Dimensions } from "react-native"
import WeekRange from "../../../components/WeekRange"
import HourMinCal from "../../../components/HourMinCal"
import { Calendar } from "react-native-calendars"
import Modal from "react-native-modal"
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
const GroupToday = ({
  myData,
  groupData,
  onRefresh,
  selectDate,
  nextDate,
  setSelectDate,
  loading,
  targetToday,
  selectPercent,
  setSelectPercent,
  selectPercent2,
  setSelectPercent2,
  navigation,
}) => {
  const [selectDay, setselectDay] = useState(targetToday)
  const lastDate = new Date(selectDate)
  lastDate.setDate(lastDate.getDate() - 7)

  //////groupData
  const { real, real_weekEnd } = WeekRange(selectDate)
  const lastMonthDate = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate()
  // daysOfMonth Area차트의 x축 라벨 변수
  const daysOfMonth_tmp = Array.from(Array(lastMonthDate).keys())
  const daysOfMonth_number = daysOfMonth_tmp.map((a) => a + 1)
  const daysOfMonth = daysOfMonth_number.map(String)

  //onegroup
  const [modalVisible, setModalVisible] = useState(false)

  const todayTime_calculate = ({ times }) => {
    let indiTimes = times
    // 오늘 생선된 시간이 있는 인덱스 구하기
    let indexOfToday = indiTimes.findIndex(
      (i) =>
        new Date(i.createdAt).getFullYear() === selectDate.getFullYear() &&
        new Date(i.createdAt).getMonth() === selectDate.getMonth() &&
        new Date(i.createdAt).getDate() === selectDate.getDate()
    )
    // today Time 없을 경우 값이 0인 Time 추가해주기
    if (indexOfToday === -1) {
      indiTimes.push({
        existTime: 0,
        time_24: new Array(288).fill(0),
      })
      indexOfToday = indiTimes.length - 1
    }
    return {
      today_existTime: indiTimes[indexOfToday].existTime,
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

      const { today_existTime } = todayTime_calculate({
        times: nowMember.times,
      })
      total_existTime = today_existTime

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
  useEffect(() => {}, [])
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
export default GroupToday
