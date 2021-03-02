import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Container = styled.TextInput`
  border: 0;
  border: ${(props) => props.theme.boxBorder};
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.bgColor};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
  font-size: 12px;
  padding: 0px 15px;
`

const Input = ({
  placeholder,
  required = true, // 꼭 입력해야한다는 뜻인거 같음
  value,
  onChange,
  type = "text",
  className,
  width = "100%",
  height = "100%",
  step,
  bgColor = "#fafafa",
  margin,
}) => (
  <Container
    className={className}
    placeholder={placeholder}
    required={required}
    value={value}
    onChange={onChange}
    type={type}
    step={step}
    width={width}
    height={height}
    bgColor={bgColor}
    margin={margin}
  />
)

Input.propTypes = {
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
}

export default Input
