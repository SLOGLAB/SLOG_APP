import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import constants from "../constants"

const Container = styled.View`
  margin: ${(props) => props.marginArray[0]}px ${(props) => props.marginArray[1]}px
    ${(props) => props.marginArray[2]}px ${(props) => props.marginArray[3]}px;
`

const TextInput = styled.TextInput`
  width: ${(props) => constants.width / props.widthRatio};
  padding: ${(props) => props.paddingArray[0]}px ${(props) => props.paddingArray[1]}px
    ${(props) => props.paddingArray[2]}px ${(props) => props.paddingArray[3]}px;
  background-color: ${(props) => props.theme.greyColor};
  border: 0.5px solid ${(props) => props.theme.darkGreyColor};
  border-radius: 4px;
`

const TextInput2 = styled.TextInput`
  padding: ${(props) => props.paddingArray[0]}px ${(props) => props.paddingArray[1]}px
    ${(props) => props.paddingArray[2]}px ${(props) => props.paddingArray[3]}px;
  background-color: ${(props) => props.theme.greyColor};
  border: 0.5px solid ${(props) => props.theme.darkGreyColor};
  border-radius: 4px;
`

const AuthInputline = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
  secureTextEntry,
  widthRatio = 1.7,
  marginArray = [0, 0, 10, 0],
  paddingArray = [10, 10, 10, 10],
  nonWidth = false,
  numberOfLines,
}) => {
  return (
    <Container marginArray={marginArray}>
      {nonWidth ? (
        <TextInput2
          onChangeText={onChange}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          autoCorrect={autoCorrect}
          value={value}
          secureTextEntry={secureTextEntry}
          paddingArray={paddingArray}
          numberOfLines={numberOfLines}
          multiline
        />
      ) : (
        <TextInput
          onChangeText={onChange}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          autoCorrect={autoCorrect}
          value={value}
          secureTextEntry={secureTextEntry}
          widthRatio={widthRatio}
          paddingArray={paddingArray}
          numberOfLines={numberOfLines}
          multiline
        />
      )}
    </Container>
  )
}

AuthInputline.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    "default",
    "number-pad",
    "decimal-pad",
    "numeric",
    "email-address",
    "phone-pad",
  ]),
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool,
}

export default AuthInputline
