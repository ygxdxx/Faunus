<template>
  <div v-show="playList.length>0" class="player">
    <transition name="normal"
                @enter="onEnter"
                @after-enter="onAfterEnter"
                @leave="onLeave"
                @afterLeave="onAfterLeave"
    >
      <div v-show="fullScreen"
           :src="currentSong.image"
           class="normal-player"
      >
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="onNormalClickBack">
            <i class="icon-back"></i>
          </div>
          <h1 v-html="currentSong.name" class="title"></h1>
          <h2 v-html="currentSong.singer" class="subtitle"></h2>
        </div>
        <div @touchstart.prevent="onMiddleTouchStart"
             @touchmove.prevent="onMiddleTouchMove"
             @touchend="onMiddleTouchEnd"
             class="middle"
        >
          <div ref="middleL" class="middle-l">
            <div ref="cdWrapper" class="cd-wrapper">
              <div class="cd" :class="cdRotate">
                <img :src="currentSong.image" class="image">
              </div>
            </div>
          </div>
          <base-scroll ref="lyricList"
                       :data="currentLyric && currentLyric.lines"
                       class="middle-r"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </base-scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="{'active':currentShow === 'cd'}" class="dot"></span>
            <span :class="{'active':currentShow === 'lyric'}" class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_timeFormat(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @percentChange="onPercentChange"
              />
            </div>
            <span class="time time-r">{{_timeFormat(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div @click="onModeChange" class="icon i-left">
              <i :class="iconMode"></i>
            </div>
            <div @click="onSongPrev"
                 :class="btnDisable"
                 class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div @click="onTogglePlay"
                 class="icon i-center">
              <i :class="playIcon"></i>
            </div>
            <div @click="onSongNext"
                 :class="btnDisable"
                 class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div v-show="!fullScreen"
           @click="onMiniClickOpen"
           class="mini-player"
      >
        <div class="icon">
          <img width="40"
               height="40"
               :class="cdRotate"
               :src="currentSong.image">
        </div>
        <div class="text">
          <h2 v-html="currentSong.name" class="name"></h2>
          <p v-html="currentSong.singer" class="desc"></p>
        </div>
        <div @click.stop="onTogglePlay" class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniPlayIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      @canplay="onReady"
      @error="onError"
      @timeupdate="onTimeUpdate"
      @ended="onSongEnd"
      :src="currentSong.url">
    </audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/until'
  import LyricParser from 'lyric-parser'
  import BaseScroll from 'base/scroll/scroll'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  const durationTime = 300

  export default {
    name: 'Player',
    created () {
      this.touch = {}
    },
    data () {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd'
      }
    },
    computed: {
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      btnDisable () {
        return this.songReady ? '' : 'disable'
      },
      cdRotate () {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'currentIndex',
        'playing',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAYMODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      onPercentChange (newPercent) {
        this.$refs.audio.currentTime = this.currentSong.duration * newPercent
        if (!this.playing) {
          this.onTogglePlay()
        }
      },
      onTimeUpdate (e) {
        this.currentTime = e.target.currentTime
      },
      _timeFormat (interval) {
        interval = Math.floor(interval)
        const minute = Math.floor(interval / 60)
        const second = interval % 60
        return `${this._padLeft(minute)}:${this._padLeft(second)}`
      },
      _padLeft (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      onReady () {
        this.songReady = true
      },
      onError () {
        this.songReady = false
      },
      onSongEnd () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.onSongNext()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
      onSongPrev () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.onTogglePlay()
        }
        this.songReady = false
      },
      onSongNext () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.onTogglePlay()
        }
        this.songReady = false
      },
      onNormalClickBack () {
        this.setFullScreen(false)
      },
      onMiniClickOpen () {
        this.setFullScreen(true)
      },
      onEnter (el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 1000,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      onAfterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      onLeave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      onAfterLeave () {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      onTogglePlay () {
        this.setPlayingState(!this.playing)
      },
      _getPosAndScale () {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const cdWidth = window.innerWidth * 0.8
        const scale = targetWidth / cdWidth
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - cdWidth / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      onModeChange () {
        const currentMode = (this.mode + 1) % 3
        this.setPlayMode(currentMode)
        let list = null
        if (currentMode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this._resetCurrentIndex(list)
        this.setPlayList(list)
      },
      _resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      getCurrentLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new LyricParser(lyric, this._handleLyricCallback)
          if (this.playing) {
            this.currentLyric.play()
          }
        }, (errMsg) => {
          console.log(errMsg)
        })
      },
      _handleLyricCallback ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEle = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEle)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      },
      onMiddleTouchStart (e) {
        this.touch.touchFlag = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      onMiddleTouchMove (e) {
        if (!this.touch.touchFlag) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const initialLeft = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offset = Math.min(0, Math.max(-window.innerWidth, deltaX + initialLeft))
        this.touch.movePercent = Math.abs(offset / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offset}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.movePercent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      onMiddleTouchEnd () {
        this.touch.touchFlag = false
        let offset = null
        let opacity
        //从右向左滑动
        if (this.currentShow === 'cd') {
          if (this.touch.movePercent > 0.1) {
            offset = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offset = 0
            opacity = 1
          }
        } else {
          //从左向右滑动
          if (this.touch.movePercent < 0.9) {
            offset = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offset = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offset}px,0,0)`
        //动画效果
        this.$refs.lyricList.$el.style[transitionDuration] = `${durationTime}ms`
        //CD是否出现
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${durationTime}ms`
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getCurrentLyric()
        })
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      BaseScroll
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 20px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 35px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>
