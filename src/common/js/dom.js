export function commonAddClz (el, className) {
  if (!hasClz(el, className)) {
    el.classList.add(className)
  }
}

function hasClz (el, className) {
  return el.classList.contains(className)
}
