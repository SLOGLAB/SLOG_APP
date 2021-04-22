import moment from "moment"

export default (refDate) => {
  return {
    [moment(refDate).format("YYYY-MM-DD")]: {
      selected: true,
      selectedColor: "#0F4C82",
    },
  }
}
