import React, { useState, useEffect } from "react"
import SumArray from "../components/SumArray"
import moment, { Moment } from "moment"
import { Alert } from "react-native"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLabel,
  VictoryTheme,
} from "victory-native"

const StackedWMBar = ({ data_1, data_2, labels, label_1, label_2, title, title_x, stepSize_x }) => {
  let existArray = []
  let targetArray = []
  if (labels.length !== 0) {
    existArray = labels.map((label, index) => {
      const a = {}
      a.x = label
      // a.y = Math.floor(data_1[index])
      a.y = data_1[index]
      return a
    })
    targetArray = labels.map((label, index) => {
      const a = {}
      a.x = label
      a.y = data_2[index] - data_1[index]
      a.z = data_1[index]
      return a
    })
  } else {
    existArray = [
      {
        x: "",
        y: 0,
        z: 0,
      },
    ]
    targetArray = [
      {
        x: "",
        y: 0,
        z: 0,
      },
    ]
  }
  // useEffect(() => {
  //   console.log(data_1, "data1")
  //   console.log(data_2, "data2")
  //   console.log(labels[0].length)
  // }, [])
  function replaceRobotoWithSystemFont(obj) {
    const keys = Object.keys(obj)
    keys.forEach(function (key) {
      const value = obj[key]
      if (key === "fontFamily") {
        obj[key] = obj[key].replace("'Roboto',", "'System',")
      }
      if (typeof value === "object") {
        replaceRobotoWithSystemFont(obj[key])
      }
    })
    return obj
  }

  const themeWithSystemFont = replaceRobotoWithSystemFont({ ...VictoryTheme.material })

  return (
    <VictoryChart
      theme={themeWithSystemFont}
      domain={{
        x: [0, labels.length + 1],
        y: [0, data_2.length === 0 ? 1 : Math.max.apply(null, data_2)],
      }}
      height={200}
      padding={{ top: 10, bottom: 20, left: 75, right: 56 }}
      domainPadding={{ x: 5, y: 10 }}
    >
      {/* <VictoryAxis tickFormat={labels} /> */}
      <VictoryAxis style={{ labels: { fontSize: 10 } }} />

      <VictoryAxis />
      {/* <VictoryAxis tickValues={[0, 6, 12, 18, 24]} /> */}
      <VictoryStack
        colorScale={["rgba(123, 169, 234, 1)", "rgba(233, 237, 244, 1)"]}
        style={{ data: { width: 80 / targetArray.length } }}
      >
        <VictoryBar
          horizontal
          data={existArray}
          // labels={({ datum }) => datum.y}
          labels={({ datum }) =>
            datum.y < 1
              ? Math.floor(datum.y * 60) + "m"
              : Math.floor(datum.y) + "h" + Math.floor((datum.y - Math.floor(datum.y)) * 60) + "m"
          }
          style={{
            labels: {
              fill: ({ datum }) =>
                datum.y === 0 ? "rgba(233, 237, 244, 0)" : "rgba(123, 169, 234, 1)",
              fontSize: 13,
            },
          }}
          labelComponent={<VictoryLabel dy={0} />}
        />
        <VictoryBar
          horizontal
          data={targetArray}
          labels={({ datum }) =>
            datum.y + datum.z < 1
              ? Math.floor((datum.y + datum.z) * 60) + "m"
              : Math.floor(datum.y + datum.z) +
                "h" +
                Math.floor((datum.y + datum.z - Math.floor(datum.y + datum.z)) * 60) +
                "m"
          }
          style={{ labels: { fill: "rgba(233, 237, 244, 1)", fontSize: 12 } }}
          labelComponent={<VictoryLabel dy={0} />}
        />
      </VictoryStack>
    </VictoryChart>
  )
}

export default StackedWMBar

{
  /* <VictoryBar
horizontal
data={[
  { x: "a", y: 2 },
  { x: "b", y: 3 },
  { x: "c", y: 5 },
]}
/>
<VictoryBar
horizontal
data={[
  { x: "a", y: 1 },
  { x: "b", y: 4 },
  { x: "c", y: 5 },
]}
/> */
}

// const [subjectExistTime, setsubjectExistTime] = useState([])
// const [vsubjecteData, setVsubjecteData] = useState([])
// const [vexistData, setvexistData] = useState([])
// const [subjecBarname, setsubjecBarname] = useState([])
// const [highestTimes, sethighestTimes] = useState([0])

// const [highY, sethighY] = useState(0)
// const [highX, sethighX] = useState(0)

// ///////////////////////////////////////////////////////////////////////

// var subjecBarTargetTimes = []
// var subjecBarExistTimes = []
// const sum = async () => {
//   try {
//     subjecBarTargetTimes = []
//     subjecBarExistTimes = []
//     if (subjectTime.length !== 0) {
//       for (var i = 0; i < subjectTime.length; i++) {
//         subjecBarTargetTimes.push({
//           x: subjectTime[i][0].subjectName,
//           y: SumArray(subjectTime[i].map((x) => x.totalTime)) / 60000,
//         })
//       }

//       // console.log(subjecBarTargetTimes)
//       setVsubjecteData(subjecBarTargetTimes)
//       sethighestTimes(subjecBarTargetTimes.map((k) => k.y))
//       setsubjecBarname(subjecBarTargetTimes.map((k) => k.x))
//       sethighX(subjecBarTargetTimes.length)
//       sethighY(
//         Math.max.apply(
//           null,
//           subjecBarTargetTimes.map((k) => k.y)
//         ) + 10
//       )
//       // console.log(highY, "highY")
//     } else {
//       setVsubjecteData([])
//       sethighestTimes(0)
//       setsubjecBarname([])
//       sethighY(0)
//       sethighX(0)
//     }

//     ///////////////////////////////////////////////////////////////////////

//     if (subjectExistTime.length !== 0) {
//       for (var i = 0; i < subjectExistTime.length; i++) {
//         subjecBarExistTimes.push({
//           x: subjectExistTime[i][0].label,
//           y: SumArray(subjectExistTime[i].map((x) => x.value)) / 60,
//         })
//       }
//       setvexistData(subjecBarExistTimes)
//       // console.log(subjecBarExistTimes, "1")
//     } else {
//       for (var i = 0; i < subjectTime.length; i++) {
//         subjecBarExistTimes.push({
//           x: subjectTime[i][0].subjectName,
//           y: 0,
//         })
//       }
//       setvexistData(subjecBarExistTimes)
//       // console.log(subjecBarExistTimes, "2")
//     }
//   } catch (error) {
//   } finally {
//   }
// }
// if (refreshing) {
//   sum()
// }
// ////////////////////////////////////////////////////////////////////////
// useEffect(() => {
//   sum()
// }, [refreshing])
