function range(count) {
  return [...Array(count).keys()]
}

function mutex(obj, key) {
  const _key = '__mutex_' + key

  if (obj[_key]) {
    return false
  }

  obj[_key] = true
  return true
}

function mutexRelease(obj, key) {
  const _key = '__mutex_' + key
  delete obj[_key]
}

function intersect(a, b) {
  const intersects = new Set()
  for (const key of a) {
    if (b.has(key)) {
      intersects.add(key)
    }
  }
  return intersects
}

function exclude(a, b) {
  const newSet = new Set(a)
  for (const key of b) {
    newSet.delete(key)
  }
  return newSet
}

function keyBy(array, key) {
  const obj = {}
  for (const element of array) {
    obj[element[key]] = element
  }
  return obj
}

module.exports = {
  range,
  mutex,
  mutexRelease,
  intersect,
  exclude,
  keyBy
}
