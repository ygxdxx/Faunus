<template>
  <base-scroll
    ref="scroller"
    :data="data"
    v-if="data.length"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="onScroll"
    class="listview"
  >
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
            @click="selectItem(innerItem)"
            :key="innerItem.id"
            class="list-group-item"
          >
            <img
              v-lazy="innerItem.avatar"
              class="avatar"
            >
            <p
              v-html="innerItem.name"
              class="name"
            >
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div
      @touchstart="onAlphabetTouchStart"
      @touchmove.stop.prevent="onAlphabetTouchMove"
      @touchend="onAlphabetTouchEnd"
      class="list-shortcut"
    >
      <ul>
        <li
          v-for="(letter,index) in buildLetterList"
          :key="letter"
          :data-index="index"
          :class="{'current': currentIndex === index}"
          class="item"
        >
          {{letter}}
        </li>
      </ul>
    </div>
    <div
      ref="fixed"
      v-show="fixedTitle"
      class="list-fixed"
    >
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </base-scroll>
</template>

<script>
  import BaseScroll from 'base/scroll/scroll'
  import {processAttr} from 'common/js/dom'

  const LETTER_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    name: 'BaseListview',
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: 0
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
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
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
        if (!this.touchStatus) {
          return
        }
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          let currentTouchY = e.touches[0].pageY
          let deltaNum = Math.floor((currentTouchY - this.touches.firstTouchY) / LETTER_HEIGHT)
          let currentAnchorIndex = parseInt(this.touches.firstAnchorIndex) + deltaNum
          if (parseInt(currentAnchorIndex) >= 0 && parseInt(currentAnchorIndex) < this.data.length) {
            this._scrollToElement(currentAnchorIndex)
          }
        }, 20)
      },
      onAlphabetTouchEnd () {
        this.touchStatus = false
      },
      onScroll (posObj) {
        this.scrollY = posObj.y
      },
      selectItem (singer) {
        this.$emit('select',singer)
      },
      _scrollToElement (index) {
        this.scrollY = -this.listHeight[index]
        this.$refs.scroller.scrollToElement(this.$refs.outerItem[index])
      },
      _caculateHeight () {
        const list = this.$refs.outerItem
        let totalHeight = 0
        this.listHeight.push(totalHeight)
        for (let i = 0, len = list.length; i < len; i++) {
          let item = list[i]
          totalHeight += item.clientHeight
          this.listHeight.push(totalHeight)
        }
      }
    },
    created () {
      this.touches = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    watch: {
      data () {
        setTimeout(() => {
          this._caculateHeight()
        }, 20)
      },
      scrollY (currentY) {
        //列表在顶部向下拉
        if (currentY >= 0) {
          this.currentIndex = 0
          return
        }
        //列表在A-Z范围内
        for (let i = 0, len = this.listHeight.length - 1; i < len; i++) {
          let low = this.listHeight[i]
          let high = this.listHeight[i + 1]
          if (-currentY >= low && -currentY < high) {
            this.currentIndex = i
            this.diff = high + this.scrollY
            return
          }
        }
        //列表在底部向上拉
        this.currentIndex = this.listHeight.length - 1
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
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
