import { useState } from "react";

export default (defaultValue, validator, checker) => {
  const [value, setValue] = useState(defaultValue);
  const [errorChk, setErrorChk] = useState(false);

  const onChange = (value) => {
    let willUpdate = true;
    if (typeof validator === "function") {
      willUpdate = validator(value);
    }
    if (willUpdate) {
      setValue(value);
    }

    let willCheck = true; // true가 정상인 상태 (예, 실시간 비밀번호 조건 체크문용)
    if (typeof checker === "function") {
      willCheck = checker(value);
    }
    if (willCheck) {
      setErrorChk(true);
    } else setErrorChk(false);
  };
  return { value, onChange, setValue, errorChk };
};
