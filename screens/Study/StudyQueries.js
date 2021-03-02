import { gql } from 'apollo-boost';

export const START_SCHEDULE = gql`
  mutation startSchedule_study(
    $title: String!
    $start: String!
    $end: String!
    $totalTime: Int!
    $calendarId: String!
    $state: String!
    $existTodo: Boolean!
  ) {
    startSchedule_study(
      title: $title
      start: $start
      end: $end
      totalTime: $totalTime
      calendarId: $calendarId
      state: $state
      existTodo: $existTodo
    )
  }
`;

export const STOP_SCHEDULE = gql`
  mutation stopSchedule_study(
    $scheduleId: String!
    $totalTime: Int!
    $end: String!
    $deleteBool: Boolean!
  ) {
    stopSchedule_study(
      scheduleId: $scheduleId
      totalTime: $totalTime
      end: $end
      deleteBool: $deleteBool
    )
  }
`;

export const PULL_SCHEDULE = gql`
  mutation pullSchedule_study(
    $scheduleId: String!
    $start: String!
    $end: String!
  ) {
    pullSchedule_study(scheduleId: $scheduleId, start: $start, end: $end)
  }
`;

export const CUT_SCHEDULE = gql`
  mutation cutSchedule_study(
    $scheduleId: String!
    $totalTime: Int!
    $end: String!
    $deleteBool: Boolean!
  ) {
    cutSchedule_study(
      scheduleId: $scheduleId
      totalTime: $totalTime
      end: $end
      deleteBool: $deleteBool
    )
  }
`;

export const EXTENSION_SCHEDULE = gql`
  mutation extensionSchedule_study(
    $scheduleId: String!
    $totalTime: Int!
    $end: String!
    $cutId: String!
    $cutTotalTime: Int!
    $deleteArray: [schedule_delete!]!
  ) {
    extensionSchedule_study(
      scheduleId: $scheduleId
      totalTime: $totalTime
      end: $end
      cutId: $cutId
      cutTotalTime: $cutTotalTime
      deleteArray: $deleteArray
    )
  }
`;

export const EDIT_STUDYSET = gql`
  mutation editStudySet(
    $timelapseRecord: Boolean
    $nonScheduleRecord: Boolean
    $autoRefresh: Boolean
    $autoRefreshTerm: Int
    $startScheduleTerm: Int
    $cutExtenTerm: Int
    $scheduleStart: Int
    $scheduleEnd: Int
    $dDayOn: Boolean
    $dDateName: String
    $dDate: String
  ) {
    editStudySet(
      timelapseRecord: $timelapseRecord
      nonScheduleRecord: $nonScheduleRecord
      autoRefresh: $autoRefresh
      autoRefreshTerm: $autoRefreshTerm
      startScheduleTerm: $startScheduleTerm
      cutExtenTerm: $cutExtenTerm
      scheduleStart: $scheduleStart
      scheduleEnd: $scheduleEnd
      dDayOn: $dDayOn
      dDateName: $dDateName
      dDate: $dDate
    )
  }
`;

export const GO_WITH = gql`
  mutation goWith($followDateId: String!, $goWithBool: Boolean!) {
    goWith(followDateId: $followDateId, goWithBool: $goWithBool)
  }
`;
