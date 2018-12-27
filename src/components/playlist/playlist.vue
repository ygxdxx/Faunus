<template>
  <transition name="list-fade">
    <div @click="hide"
         v-show="showFlag"
         class="playlist">
      <div @click.stop class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i @click="onModeChange"
               :class="iconMode"
               class="icon">
            </i>
            <span class="text">{{modeText}}</span>
            <span @click="onShowConfirm" class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <base-scroll :data="sequenceList"
                     ref="scroller"
                     class="list-content">
          <transition-group name="list" tag="ul">
            <li v-for="(item,index) of sequenceList"
                :key="item.id"
                ref="listItem"
                @click="onClickListSong(item,index)"
                class="item">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span @click.stop="onDeleteListSong(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </base-scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加到歌曲列表</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="dialog"
               @dialog-confirm="onConfirmClear"
               confirmText="清空"
               text="是否清空播放列表"/>
    </div>
  </transition>
</template>

<script>
  import {mapActions} from 'vuex'
  import BaseScroll from 'base/scroll/scroll'
  import {playMode} from 'common/js/config'
  import Confirm from 'base/confirm/confirm'
  import {playerMxin} from 'common/js/mixin'

  export default {
    name: 'playlist',
    mixins: [playerMxin],
    data () {
      return {
        showFlag: false
      }
    },
    computed: {
      modeText () {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    components: {
      BaseScroll,
      Confirm
    },
    methods: {
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ]),
      show () {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.scroller.refresh()
        }, 20)
        this.scrollToCurrent(this.currentSong)
      },
      hide () {
        this.showFlag = false
      },
      getCurrentIcon (item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        } else {
          return ''
        }
      },
      onClickListSong (item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return item.id === song.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      //删除列表中的歌曲
      onDeleteListSong (item) {
        this.deleteSong(item)
        if (!this.playList.length) {
          this.hide()
        }
      },
      //让列表滚动到正在播放的位置
      scrollToCurrent (current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        this.$refs.scroller.scrollToElement(this.$refs.listItem[index], 300)
      },
      onShowConfirm () {
        this.$refs.dialog.show()
      },
      //confirm组件发送的确认消息
      onConfirmClear () {
        this.deleteSongList()
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
