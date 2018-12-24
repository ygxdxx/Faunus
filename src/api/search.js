import {commonJSONP} from 'common/js/jsonp'
import {apiCommonParams, apiOptions} from './config'
import axios from 'axios'

export function getHotKeys () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, apiCommonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return commonJSONP(url, data, apiOptions)
}

export function search (query, page, zhida, perpage = 20) {
  const url = '/api/search'

  const data = Object.assign({}, apiCommonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    //传入的参数
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    perpage: perpage,
    p: page,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    n: 20,
    remoteplace: 'txt.mqq.all',
    _: +new Date()
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
