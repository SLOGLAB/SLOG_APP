import React, { Component } from "react"
import PropTypes from "prop-types"
import { View, ScrollView, Dimensions, Animated } from "react-native"
import moment from "moment"
import memoizeOne from "memoize-one"
import Loader from "../../../../../components/Loader"
import Event from "../Event/Event"
import Events from "../Events/Events"
import Header from "../Header/Header"
import Title from "../Title/Title"
import Times from "../Times/Times"
import styles from "./WeekView.styles"
import { TIME_LABELS_IN_DISPLAY, CONTAINER_HEIGHT, DATE_STR_FORMAT, setLocale } from "../utils"
import { selectDate } from "../../../TimeWeek"
import { TouchableOpacity } from "react-native-gesture-handler"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const MINUTES_IN_DAY = 60 * 24

export default class WeekView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentMoment: props.selectedDate,
    }
    this.state = {
      currentMoment2: props.selectedDate,
    }
    this.state = {
      refreshing: false,
    }
    this.eventsGrid = null
    this.eventsGrid2 = null
    this.verticalAgenda = null
    this.verticalAgenda2 = null
    this.header = null
    this.header2 = null
    this.pagesLeft = 1
    this.pagesRight = 1
    this.currentPageIndex = 1
    this.totalPages = this.pagesLeft + this.pagesRight + 1
    this.eventsGridScrollX = new Animated.Value(0)
    this.eventsGridScrollX2 = new Animated.Value(0)
    this.viewBool1 = true
    this.viewBool2 = false

    this.onScroll_1 = this.onScroll_1.bind(this)
    this.onScroll_2 = this.onScroll_2.bind(this)

    setLocale(props.locale)
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.eventsGrid.scrollTo({
        y: 0,
        x: 1 * (SCREEN_WIDTH - 60),
        animated: false,
      })
      this.eventsGrid2.scrollTo({
        y: 0,
        x: 1 * (SCREEN_WIDTH - 60),
        animated: false,
      })
      this.scrollToAgendaStart()
    })
    this.eventsGridScrollX.addListener((position) => {
      this.header.scrollTo({ x: position.value, animated: false })
    })
    this.eventsGridScrollX2.addListener((position) => {
      this.header2.scrollTo({ x: position.value, animated: false })
    })
  }

  componentDidUpdate(prevprops) {
    if (this.props.selectedDate && this.props.selectedDate !== prevprops.selectedDate) {
      if (this.viewBool1) {
        this.setState({ currentMoment: this.props.selectedDate })
        this.setState({ currentMoment2: this.props.selectedDate })
      }
      if (this.viewBool2) {
        this.setState({ currentMoment2: this.props.selectedDate })
        this.setState({ currentMoment: this.props.selectedDate })
      }
    }
    if (this.props.locale !== prevprops.locale) {
      setLocale(this.props.locale)
    }

    // this.eventsGrid.scrollTo({
    //   y: 0,
    //   x: 1 * (SCREEN_WIDTH - 60),
    //   animated: false,
    // })
  }

  componentWillUnmount() {
    this.eventsGridScrollX.removeAllListeners()
    this.eventsGridScrollX2.removeAllListeners()
  }

  calculateTimes = memoizeOne((hoursInDisplay) => {
    const times = []
    const timeLabelsPerHour = TIME_LABELS_IN_DISPLAY / hoursInDisplay
    const minutesStep = 60 / timeLabelsPerHour
    for (let timer = 0; timer < MINUTES_IN_DAY; timer += minutesStep) {
      let minutes = timer % 60
      if (minutes < 10) minutes = `0${minutes}`
      const hour = Math.floor(timer / 60)
      const timeString = `${hour}:${minutes}`
      times.push(timeString)
    }
    return times
  })

  scrollToAgendaStart = () => {
    if (this.verticalAgenda) {
      const { startHour, hoursInDisplay } = this.props
      const startHeight = (startHour * CONTAINER_HEIGHT) / hoursInDisplay
      this.verticalAgenda.scrollTo({ y: startHeight, x: 0, animated: false })
      this.verticalAgenda2.scrollTo({ y: startHeight, x: 0, animated: false })
    }
  }

  scrollEnded = (event) => {
    // this.setState({ refreshing: true })
    const {
      nativeEvent: { contentOffset, contentSize },
    } = event
    const { x: position } = contentOffset
    const { width: innerWidth } = contentSize
    const newPage = (position / innerWidth) * this.totalPages
    const movedPages = newPage - this.currentPageIndex
    if (movedPages === 0) {
      return
    }
    const { onSwipePrev, onSwipeNext, numberOfDays } = this.props
    const { currentMoment } = this.state
    requestAnimationFrame(() => {
      const newMoment = moment(currentMoment)
        .add(movedPages * numberOfDays, "d")
        .toDate()
      if (this.viewBool1) {
        this.viewBool1 = false
        this.viewBool2 = true
        this.setState({ currentMoment2: newMoment })
        this.setState({ currentMoment: newMoment })
        this.eventsGrid.scrollTo({
          y: 0,
          x: 1 * (SCREEN_WIDTH - 60),
          animated: false,
        })
        selectDate[0] = new Date(newMoment)
      } else {
        this.viewBool1 = true
        this.viewBool2 = false
        this.setState({ currentMoment: newMoment })
        this.setState({ currentMoment2: newMoment })
        this.eventsGrid2.scrollTo({
          y: 0,
          x: 1 * (SCREEN_WIDTH - 60),
          animated: false,
        })
        selectDate[0] = new Date(newMoment)
      }

      // this.setState({ refreshing: false })

      if (movedPages < 0) {
        onSwipePrev && onSwipePrev(newMoment)
      } else {
        onSwipeNext && onSwipeNext(newMoment)
      }
    })
  }

  eventsGridRef = (ref) => {
    this.eventsGrid = ref
  }
  eventsGridRef2 = (ref) => {
    this.eventsGrid2 = ref
  }

  verticalAgendaRef = (ref) => {
    this.verticalAgenda = ref
  }
  verticalAgendaRef2 = (ref) => {
    this.verticalAgenda2 = ref
  }

  headerRef = (ref) => {
    this.header = ref
  }
  headerRef2 = (ref) => {
    this.header2 = ref
  }

  onScroll_1 = (event) => {
    this.verticalAgenda2.scrollTo({ y: event.nativeEvent.contentOffset.y, x: 0, animated: false })
  }
  onScroll_2 = (event) => {
    this.verticalAgenda.scrollTo({ y: event.nativeEvent.contentOffset.y, x: 0, animated: false })
  }

  calculatePagesDates = memoizeOne((currentMoment, numberOfDays) => {
    const initialDates = []
    const modifyDate = new Date(currentMoment)
    const nowDate = new Date()
    modifyDate.setDate(modifyDate.getDate() + (nowDate.getDay() - modifyDate.getDay()))
    for (let i = -this.pagesLeft; i <= this.pagesRight; i += 1) {
      const initialDate = moment(currentMoment ? modifyDate : nowDate).add(numberOfDays * i, "d")
      initialDates.push(initialDate.format(DATE_STR_FORMAT))
    }
    return initialDates
  })

  sortEventsByDate = memoizeOne((events) => {
    // Stores the events hashed by their date
    // For example: { "2020-02-03": [event1, event2, ...] }
    // If an event spans through multiple days, adds the event multiple times
    const sortedEvents = {}
    events.forEach((event) => {
      const startDate = moment(event.startDate)
      const endDate = moment(event.endDate)

      for (
        let date = moment(startDate);
        date.isSameOrBefore(endDate, "days");
        date.add(1, "days")
      ) {
        // Calculate actual start and end dates
        const startOfDay = moment(date).startOf("day")
        const endOfDay = moment(date).endOf("day")
        const actualStartDate = moment.max(startDate, startOfDay)
        const actualEndDate = moment.min(endDate, endOfDay)

        // Add to object
        const dateStr = date.format(DATE_STR_FORMAT)
        if (!sortedEvents[dateStr]) {
          sortedEvents[dateStr] = []
        }
        sortedEvents[dateStr].push({
          ...event,
          startDate: actualStartDate.toDate(),
          endDate: actualEndDate.toDate(),
        })
      }
    })
    // For each day, sort the events by the minute (in-place)
    Object.keys(sortedEvents).forEach((date) => {
      sortedEvents[date].sort((a, b) => {
        return moment(a.startDate).diff(b.startDate, "minutes")
      })
    })
    return sortedEvents
  })

  render() {
    const {
      numberOfDays,
      headerStyle,
      formatDateHeader,
      onEventPress,
      events,
      hoursInDisplay,
    } = this.props
    const { currentMoment } = this.state
    const { currentMoment2 } = this.state
    const times = this.calculateTimes(hoursInDisplay)
    const initialDates = this.calculatePagesDates(
      this.viewBool1 ? currentMoment : currentMoment2,
      numberOfDays
    )
    const eventsByDate = this.sortEventsByDate(events)
    return (
      <View style={styles.container}>
        <View style={{ height: this.viewBool1 ? SCREEN_HEIGHT : 0 }}>
          <View style={styles.headerContainer}>
            <Title style={headerStyle} numberOfDays={numberOfDays} selectedDate={currentMoment} />
            <ScrollView
              horizontal
              pagingEnabled
              scrollEnabled={true}
              automaticallyAdjustContentInsets={false}
              ref={this.headerRef}
            >
              {initialDates.map((date, index) => (
                <View key={index} style={styles.header}>
                  <Header
                    style={headerStyle}
                    formatDate={formatDateHeader}
                    initialDate={date}
                    numberOfDays={numberOfDays}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          {/* 날짜  */}
          <ScrollView ref={this.verticalAgendaRef} onMomentumScrollEnd={this.onScroll_1}>
            <View style={styles.scrollViewContent}>
              <Times times={times} />
              <ScrollView
                horizontal
                pagingEnabled
                scrollEnabled={this.state.refreshing ? false : true}
                automaticallyAdjustContentInsets={false}
                onMomentumScrollEnd={this.scrollEnded}
                scrollEventThrottle={32}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: this.eventsGridScrollX,
                        },
                      },
                    },
                  ],
                  { useNativeDriver: false }
                )}
                ref={this.eventsGridRef}
              >
                {initialDates.map((date, index) => (
                  <Events
                    key={index}
                    times={times}
                    eventsByDate={eventsByDate}
                    initialDate={date}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    hoursInDisplay={hoursInDisplay}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {/*  */}
        <View style={{ height: this.viewBool2 ? SCREEN_HEIGHT : 0 }}>
          <View style={styles.headerContainer}>
            <Title style={headerStyle} numberOfDays={numberOfDays} selectedDate={currentMoment2} />
            <ScrollView
              horizontal
              pagingEnabled
              scrollEnabled={true}
              automaticallyAdjustContentInsets={false}
              ref={this.headerRef2}
            >
              {initialDates.map((date, index) => (
                <View key={index} style={styles.header}>
                  <Header
                    style={headerStyle}
                    formatDate={formatDateHeader}
                    initialDate={date}
                    numberOfDays={numberOfDays}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          <ScrollView ref={this.verticalAgendaRef2} onMomentumScrollEnd={this.onScroll_2}>
            <View style={styles.scrollViewContent}>
              <Times times={times} />
              <ScrollView
                horizontal
                pagingEnabled
                scrollEnabled={this.state.refreshing ? false : true}
                automaticallyAdjustContentInsets={false}
                onMomentumScrollEnd={this.scrollEnded}
                scrollEventThrottle={32}
                // overScrollMode={"always"}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: this.eventsGridScrollX2,
                        },
                      },
                    },
                  ],
                  { useNativeDriver: false }
                )}
                ref={this.eventsGridRef2}
              >
                {initialDates.map((date, index) => (
                  <Events
                    key={index}
                    times={times}
                    eventsByDate={eventsByDate}
                    initialDate={date}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    hoursInDisplay={hoursInDisplay}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {/* {this.state.refreshing && (
          <View
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Loader size={"large"} />
          </View>
        )} */}
      </View>
    )
  }
}

WeekView.propTypes = {
  events: PropTypes.arrayOf(Event.propTypes.event),
  numberOfDays: PropTypes.oneOf([1, 3, 5, 7]).isRequired,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  formatDateHeader: PropTypes.string,
  onEventPress: PropTypes.func,
  headerStyle: PropTypes.object,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  startHour: PropTypes.number,
}

WeekView.defaultProps = {
  events: [],
  locale: "ko",
  hoursInDisplay: 6,
  startHour: 0,
}
