import {apiCommonParams} from './config'
import axios from 'axios'

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, apiCommonParams, {
    g_tk: 1930664565,
    pcachetime: +new Date(),
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    songmid: mid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
      return Promise.resolve(res.data)
  })
}   
