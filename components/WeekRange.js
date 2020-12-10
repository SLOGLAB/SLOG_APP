export default (refDate) => {
  // 주 기준 일요일~토요일
  var weekStart = new Date(refDate);
  var weekEnd = new Date(refDate);

  if (refDate.getDay() === 0) {
    weekEnd.setDate(weekEnd.getDate() + 6);
  } else if (refDate.getDay() === 1) {
    weekStart.setDate(weekStart.getDate() - 1);
    weekEnd.setDate(weekEnd.getDate() + 5);
  } else if (refDate.getDay() === 2) {
    weekStart.setDate(weekStart.getDate() - 2);
    weekEnd.setDate(weekEnd.getDate() + 4);
  } else if (refDate.getDay() === 3) {
    weekStart.setDate(weekStart.getDate() - 3);
    weekEnd.setDate(weekEnd.getDate() + 3);
  } else if (refDate.getDay() === 4) {
    weekStart.setDate(weekStart.getDate() - 4);
    weekEnd.setDate(weekEnd.getDate() + 2);
  } else if (refDate.getDay() === 5) {
    weekStart.setDate(weekStart.getDate() - 5);
    weekEnd.setDate(weekEnd.getDate() + 1);
  } else if (refDate.getDay() === 6) {
    weekStart.setDate(weekStart.getDate() - 6);
  }

  // var sun = new Date(weekStart);

  // var mon = new Date(weekStart);
  // mon.setDate(mon.getDate() + 1);
  // var tue = new Date(weekStart);
  // tue.setDate(tue.getDate() + 2);
  // var wed = new Date(weekStart);
  // wed.setDate(wed.getDate() + 3);
  // var thu = new Date(weekStart);
  // thu.setDate(thu.getDate() + 4);
  // var fri = new Date(weekStart);
  // fri.setDate(fri.getDate() + 5);

  // var sat = new Date(weekEnd);

  // const weekDays = [sun, mon, tue, wed, thu, fri, sat];

  var real_weekStart = new Date(weekStart);
  var real_weekEnd = new Date(weekEnd);

  real_weekStart.setMilliseconds(
    -(
      weekStart.getHours() * 3600000 +
      weekStart.getMinutes() * 60000 +
      weekStart.getSeconds() * 1000
    ),
  );

  real_weekEnd.setMilliseconds(
    -(
      weekEnd.getHours() * 3600000 +
      weekEnd.getMinutes() * 60000 +
      weekEnd.getSeconds() * 1000
    ) + 86400000,
  );

  return { weekStart, weekEnd, real_weekStart, real_weekEnd };
};
