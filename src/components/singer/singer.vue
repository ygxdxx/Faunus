<template>
  <div class="singer">
    <base-listview :data="singerList"/>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import SingerClz from 'common/js/singerClz'
  import BaseListview from 'base/listview/listview'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    name: 'Singer',
    created () {
        this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._rebuildSingerData(res.data.list)
          }
        })
      },
      _rebuildSingerData (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new SingerClz(
              item.Fsinger_mid,
              item.Fsinger_name
            ))
          }
          const key = item.Findex
          if (!map.hasOwnProperty(key)) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new SingerClz(
            item.Fsinger_mid,
            item.Fsinger_name
          ))
        })
        let hotList = []
        let normList = []
        for (let key in map) {
          let obj = map[key]
          if (key.match(/[a-zA-Z]/)) {
            normList.push(obj)
          } else if (Object.is(obj.title, HOT_NAME)) {
            hotList.push(obj)
          }
        }
        normList.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return [...hotList, ...normList]
      }
    },
    data () {
      return {
        singerList: []
      }
    },
    components: {
      BaseListview
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .singer
    position fixed
    width 100%
    top $top-height
    bottom 0
</style>
