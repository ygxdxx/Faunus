<template>
  <div ref="progressBar" class="progress-bar">
    <div class="bar-inner">
      <div ref="progress" class="progress">
      </div>
      <div ref="progressBtn" class="progress-btn-wrapper">
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
    watch: {
      percent (newPercent) {
        if (newPercent >= 0) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBarBtnWidth
          const offsetWidth = barWidth * newPercent
          this.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
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
