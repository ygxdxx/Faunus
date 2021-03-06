<template>
  <div class="recommend">
    <base-scroll ref="scroll"
                 :data="discList"
                 class="recommend-content"
                 v-if="discList.length"
    >
      <div>
        <div class="slider-wrapper" v-if="sliders.length">
          <base-slider>
            <div v-for="item in sliders">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </base-slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li v-for="item of discList"
                :key="item.dissid"
                @click="onClickDiscItem(item)"
                class="item"
            >
              <div class="icon">
                <img v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <base-loading v-show="!discList.length"/>
      </div>
    </base-scroll>
    <router-view/>
  </div>
</template>

<script>
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import BaseScroll from 'base/scroll/scroll'
  import BaseSlider from 'base/slider/slider'
  import BaseLoading from 'base/loading/loading'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: 'Recommend',
    mixins: ['playListMixins'],
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    data () {
      return {
        sliders: [],
        discList: []
      }
    },
    methods: {
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '100px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            const data = res.data
            this.sliders = data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImage () {
        if (!this.hasLoaded) {
          this.$refs.scroll.refresh()
          this.hasLoaded = true
        }
      },
      onClickDiscItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc:'SET_DISC'
      })
    },
    components: {
      BaseSlider,
      BaseScroll,
      BaseLoading
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .recommend
    position fixed
    width 100%
    top $top-height
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          color $color-theme
          font-size $font-size-medium
        .item
          display flex
          box-sizing border-box
          align-items center
          padding 0 20px 20px 20px
          .icon
            flex 0 0 60px
            padding-right 20px
            img
              width 100%
          .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
