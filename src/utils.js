export const Utils = {
  distance () {
    let count = 0
    let x1, x2, y1, y2

    if (typeof arguments[0] === 'object') {
      x1 = arguments[0].x
      y1 = arguments[0].y
      count++
    } else {
      x1 = arguments[0]
      y1 = arguments[1]
      count += 2
    }

    if (typeof arguments[count] === 'object') {
      x2 = arguments[count].x
      y2 = arguments[count].y
    } else {
      x2 = arguments[count++]
      y2 = arguments[count]
    }

    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  },

  inBounds (width, height, pointX, pointY) {
    return (pointX > 0 && pointY > 0 && pointX < width && pointY < height)
  },

  getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
