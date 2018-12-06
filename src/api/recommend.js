import {commonJSONP} from 'common/js/jsonp'
import {apiCommonParams, apiOptions} from './config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, apiCommonParams, {
    platform: 'h5',
    uni: 0,
    needNewCode: 1
  })
  return commonJSONP(url, data, apiOptions)
}
