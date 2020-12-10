export default (array1, array2) => {
  var result = []
  var ctr = 0
  var x = 0

  if (array1.length === 0) return []
  if (array2.length === 0) return []

  while (ctr < array1.length && ctr < array2.length) {
    result.push(array1[ctr] + array2[ctr])
    ctr++
  }

  if (ctr === array1.length) {
    for (x = ctr; x < array2.length; x++) {
      result.push(array2[x])
    }
  } else {
    for (x = ctr; x < array1.length; x++) {
      result.push(array1[x])
    }
  }
  return result
}
