import React from "react"
import { Ionicons } from "@expo/vector-icons"
import PropTypes from "prop-types"
import styles from "../styles"
import { Platform } from "react-native"

const NavWhiteIcon = ({ focused = true, name, color = "#FFFFFF", size = 30 }) => (
  <Ionicons name={name} color={focused ? color : styles.darkGreyColor} size={size} />
)

NavWhiteIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  focused: PropTypes.bool,
}

export default NavWhiteIcon
