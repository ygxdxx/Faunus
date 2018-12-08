import {commonJSONP} from 'common/js/jsonp'
import {apiCommonParams, apiOptions} from './config'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, apiCommonParams, {
    platform: 'h5',
    uni: 0,
    needNewCode: 1
  })
  return commonJSONP(url, data, apiOptions)
}

export function getDiscList () {
  const url = '/api/getDiscList'
  const data = Object.assign({}, apiCommonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
