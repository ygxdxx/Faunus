<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onEmitQuery"/>
    </div>
    <div v-if="!query"
         ref="shorcutWrapper"
         class="shortcut-wrapper">
      <base-scroll :data="shortcut"
                   ref="shortcut"
                   class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="item of hotKey"
                  @click="onHotKeyClick(item.k)"
                  class="item">
                <span v-html="item.k"></span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="onShowConfirm" class="clear">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory"
                         @selectHistory="onSelectHistory"
                         @deleteHistory="onDeleteHistory"/>
          </div>
        </div>
      </base-scroll>
    </div>
    <div v-if="query"
         ref="suggestResult"
         class="search-result">
      <search-suggest :query="query"
                      @onBeforeScroll="blurInput"
                      @selectSave="onSaveSearch"
                      ref="suggest"/>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             @dialog-confirm="onClearHistory"
             cacelText="清空"/>
    <transition name="slide">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import SearchSuggest from 'components/search-suggest/search-suggest'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import BaseScroll from 'base/scroll/scroll'
  import {getHotKeys} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapGetters, mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  export default {
    name: 'Search',
    mixins: ['playListMixin'],
    created () {
      this._getHotKeys()
    },
    data () {
      return {
        hotKey: [],
        query: ''
      }
    },
    components: {
      SearchBox,
      SearchSuggest,
      SearchList,
      Confirm,
      BaseScroll
    },
    computed: {
      shortcut () {
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ]),
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.shorcutWrapper.style.bottom = bottom
        this.$refs.shorcutWrapper.refresh()
        this.$refs.suggestResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      _getHotKeys () {
        getHotKeys().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      onHotKeyClick (item) {
        this.$refs.searchBox.setQuery(item)
      },
      onEmitQuery (newVal) {
        console.log('on emit')
        this.query = newVal
      },
      onSaveSearch () {
        this.saveSearchHistory(this.query)
      },
      blurInput () {
        this.$refs.searchBox.blur()
      },
      onShowConfirm () {
        this.$refs.confirm.show()
      },
      //历史记录处理
      //选中
      onSelectHistory (item) {
        this.onHotKeyClick(item)
      },
      //删除
      onDeleteHistory (item) {
        this.deleteSearchHistory(item)
      },
      //清空
      onClearHistory () {
        this.clearSearchHistory()
      }
    },
    watch: {
      query (newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$refs.shorcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      z-index 33
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
  .slide-enter-active, .slider-leave-active
    transition all 0.5s
  .slide-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)
</style>
