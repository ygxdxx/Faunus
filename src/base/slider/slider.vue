<template>
  <div
    ref="slider"
    class="slider"
  >
    <div
      ref="sliderGroup"
      class="slider-group"
    >
      <slot></slot>
    </div>
    <div class="dots">
      <span
        v-for="(item,index) in dots"
        :class="{active: index === currentPageIndex}"
        class="dot"
      >
      </span>
    </div>
  </div>
</template>

<script>
  import {commonAddClz} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'BaseSlider',
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    methods: {
      _setSliderWidth (isResize = false) {
        this.children = this.$refs.sliderGroup.children
        let oneSliderWidth = this.$refs.slider.clientWidth
        let totalWidth = 0
        for (let i = 0, len = this.children.length; i < len; i++) {
          let child = this.children[i]
          commonAddClz(child, 'slider-item')
          child.style.width = oneSliderWidth + 'px'
          totalWidth += oneSliderWidth
        }

        //better-scroll组件可以循环滚动的时候会额外增加2个元素的宽度
        if (this.loop && !isResize) {
          totalWidth += 2 * oneSliderWidth
        }

        this.$refs.sliderGroup.style.width = totalWidth + 'px'
      },
      _initSlider () {
        //better-scroll第一个参数需要传入进行滚动的DOM元素
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          // if (this.loop) {
          //   pageIndex -= 1
          // }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initSliderDots () {
        this.dots = new Array(this.children.length)
      },
      _play () {
        let pageIndex = this.currentPageIndex + 1
        // if (this.loop) {
        //   pageIndex += 1
        // }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    mounted () {
      //添加20ms延迟是为了配合页面刷新的频率
      setTimeout(() => {
        this._setSliderWidth()
        this._initSliderDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh() //重新计算
      })

    },
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slider
    min-height 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>
