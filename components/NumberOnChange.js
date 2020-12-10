import { Alert } from "react-native";
import PropTypes from "prop-types";

const NumberOnChange = ({ text, setState, validator }) => {
  let newText = "";
  let numbers = "0123456789";

  for (var i = 0; i < text.length; i++) {
    if (numbers.indexOf(text[i]) > -1) {
      newText = newText + text[i];
    } else {
      // your call back function
      Alert.alert("숫자만 입력 가능합니다.");
    }
  }
  let willUpdate = true;
  if (typeof validator === "function") {
    willUpdate = validator(newText);
  }
  if (willUpdate) {
    setState(newText);
  }
};

NumberOnChange.propTypes = {
  text: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};

export default NumberOnChange;
