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

export function getDiscSongList (disstid) {
  const url = '/api/getSongList'

  const data = Object.assign({}, apiCommonParams, {
    uin: 0,
    format: 'json',
    notice: 0,
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    disstid: disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    song_begin: 0,
    platform: 'h5',
    song_num: 100,
    _: +new Date()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
