<template>
  <div class="music-list">
    <div class="back" ref="back">
      <i class="icon-back"></i>
    </div>
    <h1 v-html="title" class="title"></h1>
    <div
      ref="bgImage"
      :style="bgStyle"
      class="bg-image"
    >
      <div ref="filter" class="filter"></div>
    </div>
    <div ref="layer" class="bg-layer"></div>
    <base-scroll
      :data="songs"
      :probeType="probeType"
      :listen-scroll="listenScroll"
      @scroll="onScroll"
      ref="list"
      class="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"/>
      </div>
    </base-scroll>
  </div>
</template>

<script>
  import SongList from 'base/song-list/song-list'
  import BaseScroll from 'base/scroll/scroll'

  const RESERVED_HEIGHT = 40

  export default {
    name: 'MusicList',
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    data () {
      return {
        scrollY: 0
      }
    },
    watch: {
      scrollY (currentY) {
        //不能先进行滚动，再进行判断，会有闪动的效果出现；一定要先判断后滚动
        let translateY = Math.max(this.maxScrollDistance, currentY)
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
        this.$refs.layer.style['webkittransform'] = `translate3d(0,${translateY}px,0)`
        let zIndex = 0
        let scale = 1
        let blur = 0
        const bgImageEle = this.$refs.bgImage
        let percent = Math.abs(currentY / this.imageHeight)
        if (currentY > 0) {
          //向下拉图片放大
          scale += percent
          zIndex = 10
        } else {
          //向上推高斯模糊
          blur = Math.min(20 * percent, 20)
          console.log(blur)
          this.$refs.filter.style['backDrop-filter'] = `blur(${blur}px)`
          this.$refs.filter.style['webkitBackDrop-filter'] = `blur(${blur}px)`
        }

        if (currentY < this.maxScrollDistance) {
          //超过最大可滚动的距离
          bgImageEle.style.height = `${RESERVED_HEIGHT}px`
          bgImageEle.style.paddingTop = 0
          zIndex = 10
        } else {
          bgImageEle.style.height = 0
          bgImageEle.style.paddingTop = '70%'
        }
        bgImageEle.style.zIndex = zIndex
        bgImageEle.style['transform'] = `scale(${scale})`
        bgImageEle.style['webkittransform'] = `scale(${scale})`
      }
    },
    methods: {
      onScroll (posObj) {
        this.scrollY = posObj.y
      }
    },
    components: {
      SongList,
      BaseScroll
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight //这是一个正值
      this.maxScrollDistance = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>