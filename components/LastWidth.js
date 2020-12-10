export default (allRatio, ratio1, ratio2) => {
  const a = allRatio
  const b = ratio1
  const c = ratio2
  return (a * b * c) / (b * c - a * c - a * b)
}
