<template>
  <base-scroll :pullup="pullup"
               :data="result"
               :beforeScroll="beforeScroll"
               @scrollPullup="onScrollPullup"
               @beforeScroll="onBeforeScroll"
               ref="scroller"
               class="suggest">
    <ul class="suggest-list">
      <li v-for="item of result"
          @click="onSelectItem(item)"
          class="suggest-item">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p v-html="getDisplayName(item)" class="text"></p>
        </div>
      </li>
    </ul>
    <loading v-show="hasMore" title=""/>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="暂无搜索结果"/>
    </div>
  </base-scroll>
</template>

<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/songClz'
  import BaseScroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SingerClz from 'common/js/singerClz'
  import NoResult from 'base/no-result/no-result'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'
  const PERPAGE = 20

  export default {
    name: 'SearchSuggest',
    components: {
      BaseScroll,
      Loading,
      NoResult
    },
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
        result: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true
      }
    },
    methods: {
      _searchKeyWord () {
        this.page = 1
        this.$refs.scroller.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._rebuildResult(res.data)
            this.checkMore(res.data)
          }
        })
      },
      onScrollPullup () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._rebuildResult(res.data))
            this.checkMore(res.data)
          }
        })
      },
      onBeforeScroll () {
        this.$emit('onBeforeScroll')
      },
      onSelectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new SingerClz(item.singermid, item.singername)
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
      },
      checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum) {
          this.hasMore = false
        }
      },
      _rebuildResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
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
          return `${item.name}-${item.singer}`
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query () {
        console.log('suggest watch query')
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
