import WeekRange from "./WeekRange";

export default (refDate) => {
  let sevenDate = new Array(7).fill(0);
  const { weekStart } = WeekRange(refDate);
  sevenDate = sevenDate.map((a, index) => {
    const tmpDate = new Date(weekStart);
    tmpDate.setDate(tmpDate.getDate() + index);
    return tmpDate;
  });

  return sevenDate;
};
