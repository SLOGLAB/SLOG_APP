// const SumArray = ({ myArray }) => {
//   let { myArray1 } = myArray
//   let ho
//   for (i = 0; i < 12; i++) {
//     ho += myArray1[i]
//   }

//   return ho
// }
// // Spl
// export default SumArray

// import React from "react"

// const SumArrays = ({ arr }) => arr.reduce((a, b) => a + b, 0)
// export default SumArrays

export default (arr) => arr.reduce((a, b) => a + b, 0)

// export default (arr) =>
//   arr.reduce(function (a, b) {
//     return a + b
//   })
