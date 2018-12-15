<template>
  <div ref="progressBar" class="progress-bar">
    <div class="bar-inner">
      <div ref="progress" class="progress">
      </div>
      <div ref="progressBtn"
           @touchstart.prevent="onProgressTouchStart"
           @touchmove.prevent="onProgressTouchMove"
           @touchend="onProgressTouchEnd"
           class="progress-btn-wrapper">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBarBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    name: 'ProgressBar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      onProgressTouchStart (e) {
        this.touch.touchFlag = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      onProgressTouchMove (e) {
        if (!this.touch.touchFlag) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBarBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._setOffsetWidth(offsetWidth)
      },
      onProgressTouchEnd () {
        this.touch.touchFlag = false
        this._triggerPerecent()
      },
      _triggerPerecent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBarBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange',percent)
      },
      _setOffsetWidth (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px` //带颜色进度条
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)` //圆点的位置
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.touchFlag) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBarBtnWidth
          const offsetWidth = barWidth * newPercent
          this._setOffsetWidth(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 12px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
