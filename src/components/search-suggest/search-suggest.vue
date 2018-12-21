<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li v-for="item of result"
          class="suggest-item">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p v-html="getDisplayName(item)" class="text"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {filterSinger} from 'common/js/songClz'

  const TYPE_SINGER = 'singer'

  export default {
    name: 'SearchSuggesr',
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        page: 1,
        result: []
      }
    },
    methods: {
      _searchKeyWord () {
        search(this.query, 1, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._rebuildResult(res.data)
            console.log(this.result)
          }
        })
      },
      _rebuildResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          //ES6 对象解构
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(data.song.list)
        }
        return ret
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.songname}-${filterSinger(item.singer)}`
        }
      }
    },
    watch: {
      query () {
        this._searchKeyWord()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
