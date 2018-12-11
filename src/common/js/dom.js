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

//封装JS预处理CSS方法，避免到处添加前缀
let elementStyle = document.createElement('div').style

let vendor = (() => {
  //只是通过transform这个属性来验证当前浏览器的类型
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'mozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
