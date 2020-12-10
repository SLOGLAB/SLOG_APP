import React from "react"
import styled from "styled-components"
// import PropTypes from "prop-types"
import constants from "../constants"

const Container = styled.View`
  margin-bottom: 10px;
`

const TextInput = styled.TextInput`
  width: ${constants.width / 9};
  padding: 10px;
  background-color: ${props => props.theme.greyColor};
  border: 0.5px solid ${props => props.theme.darkGreyColor};
  border-radius: 4px;
`

const MenuInput = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true
}) => (
  <Container>
    <TextInput
      onChangeText={onChange}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      onSubmitEditing={onSubmitEditing}
      autoCorrect={autoCorrect}
      value={value}
    />
  </Container>
)

// MenuInput.propTypes = {
//   placeholder: PropTypes.string.isRequired,
//   value: PropTypes.number.isRequired,
//   keyboardType: PropTypes.oneOf([
//     "default",
//     "number-pad",
//     "decimal-pad",
//     "numeric",
//     "email-address",
//     "phone-pad"
//   ]),
//   autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
//   onChange: PropTypes.func.isRequired,
//   returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
//   onSubmitEditing: PropTypes.func,
//   autoCorrect: PropTypes.bool
// }

export default MenuInput
