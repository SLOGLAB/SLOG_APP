import { useState } from "react"

export default (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }

  const [currentIndex, setCurrentIndex] = useState(initialTab)

  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex,
    content: allTabs,
    currentIndex: currentIndex
  }
}
