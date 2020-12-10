import React from "react"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import styles from "../styles"
import { Platform } from "react-native"

const Icon = ({  name, color, size }) => (
  <Ionicons name={name} color={ color } size={size} />
)

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  focused: PropTypes.bool,
}

export default Icon

// color={focused ? color : styles.darkGreyColor}