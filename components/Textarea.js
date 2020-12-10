import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Container = styled.textarea`
  border: 0;
  border: ${(props) => props.theme.boxBorder};
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.bgColor};
  height: 35px;
  font-size: 12px;
  padding: 15px 15px;
`

const Textarea = ({
  placeholder,
  required = true, // 꼭 입력해야한다는 뜻인거 같음
  value,
  onChange,
  className,
}) => (
  <Container
    className={className}
    placeholder={placeholder}
    required={required}
    value={value}
    onChange={onChange}
  />
)

Textarea.propTypes = {
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Textarea
