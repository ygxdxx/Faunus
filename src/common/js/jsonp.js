import originJSONP from 'jsonp'

export function jsonp (url, data, option) {
  url += (url.includes('?') ? '&' : '?') + buildParams(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function buildParams (data) {
  let url = ''
  for (let key in data) {
    let val = data.hasOwnProperty(key) ? data[key] : ''
    url += `&${key}=${encodeURIComponent(val)}`
  }

  return url ? url.substring(1) : ''
}
