import {commonJSONP} from 'common/js/jsonp'
import {apiCommonParams, apiOptions} from './config'

export function getHotKeys () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, apiCommonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return commonJSONP(url, data, apiOptions)
}

export function search (query, page, zhida) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, apiCommonParams, {
    platform: 'h5',
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhdiaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    n: 20,
    remoteplace: 'txt.mqq.all',
    needNewCode: 1,
    uin:0
  })

  return commonJSONP(url, data, apiOptions)
}
