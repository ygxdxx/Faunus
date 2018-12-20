import {commonJSONP} from 'common/js/jsonp'
import {apiCommonParams, apiOptions} from './config'

export function getRankList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
  })

  return commonJSONP(url, data, apiOptions)
}

//抓取另外的一个封面图片
export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, apiCommonParams, {
    g_tk: 1759887689,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
    _: +new Date()
  })

  return commonJSONP(url, data, apiOptions)
}
