export function commonAddClz (el, className) {
  if (!hasClz(el, className)) {
    el.classList.add(className)
  }
}

function hasClz (el, className) {
  return el.classList.contains(className)
}

export function processAttr (el, attr, val) {
  if (val) {
    return el.setAttribute(attr, val)
  } else {
    return el.getAttribute(attr)
  }
}
