import {commonJSONP} from 'common/js/jsonp'
import {apiCommonParams, apiOptions} from './config'

export function getHotKeys () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({},apiCommonParams,{
    platform: 'h5',
    needNewCode: 1
  })

  return commonJSONP(url,data,apiOptions)
}
