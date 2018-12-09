<template>
  <base-scroll
    ref="scroller"
    :data="data"
    v-if="data.length"
    class="listview">
    <ul>
      <li
        v-for="outerItem of data"
        :key="outerItem.title"
        ref="outerItem"
        class="list-group">
        <h2 class="list-group-title">{{outerItem.title}}</h2>
        <ul>
          <li
            v-for="innerItem of outerItem.items"
            :key="innerItem.id"
            class="list-group-item">
            <img
              v-lazy="innerItem.avatar"
              class="avatar">
            <p
              v-html="innerItem.name"
              class="name">
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div
      @touchstart="onAlphabetTouchStart"
      @touchmove.stop.prevent="onAlphabetTouchMove"
      @touchend="onAlphabetTouchEnd"
      class="list-shortcut">
      <ul>
        <li
          v-for="(letter,index) in buildLetterList"
          :key="letter"
          :data-index="index"
          class="item"
        >
          {{letter}}
        </li>
      </ul>
    </div>
  </base-scroll>
</template>

<script>
  import BaseScroll from 'base/scroll/scroll'
  import {processAttr} from 'common/js/dom'

  const LETTER_HEIGHT = 18

  export default {
    name: 'BaseListview',
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      BaseScroll
    },
    computed: {
      buildLetterList () {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      }
    },
    methods: {
      onAlphabetTouchStart (e) {
        this.touchStatus = true
        let anchorIndex = processAttr(e.target, 'data-index')
        if (parseInt(anchorIndex) >= 0 && parseInt(anchorIndex) < this.data.length) {
          this.touches.firstTouchY = e.touches[0].pageY
          this.touches.firstAnchorIndex = anchorIndex
          this._scrollToElement(anchorIndex)
        }
      },
      onAlphabetTouchMove (e) {
        if (this.touchStatus !== true) {
          return
        }
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          let currentTouchY = e.touches[0].pageY
          let deltaNum = Math.floor((currentTouchY - this.touches.firstTouchY) / LETTER_HEIGHT)
          let currentAnchorIndex = parseInt(this.touches.firstAnchorIndex) + deltaNum
          console.log(currentAnchorIndex)
          if (parseInt(currentAnchorIndex) >= 0 && parseInt(currentAnchorIndex) < this.data.length) {
            this._scrollToElement(currentAnchorIndex)
          }
        }, 18)
      },
      onAlphabetTouchEnd () {
        this.touchStatus = false
      },
      _scrollToElement (index) {
        this.$refs.scroller.scrollToElement(this.$refs.outerItem[index])
      }
    },
    created () {
      this.touches = {}
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 20px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
