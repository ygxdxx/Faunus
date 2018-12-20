<template>
  <div ref="rank" class="rank">
    <base-scroll :data="topList"
                 ref="scroller"
                 class="toplist">
      <ul>
        <li v-for="item of topList"
            @click="onItemClick(item)"
            class="item">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li v-for="(innerItem,index) of item.songList" class="song">
              <span>{{index+1}}</span>
              <span>{{innerItem.songname}}-{{innerItem.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div v-if="!topList.length" class="loading-container">
        <base-loading/>
      </div>
    </base-scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRankList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import BaseScroll from 'base/scroll/scroll'
  import BaseLoading from 'base/loading/loading'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: 'Rank',
    mixins: ['playListMixin'],
    created () {
      this._getRankList()
    },
    data () {
      return {
        topList: []
      }
    },
    methods: {
      _getRankList () {
        getRankList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      onItemClick (item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        console.log(item)
        this.setRank(item)
      },
      handlePlayList () {
        //mixin
        const bottom = playList.length ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.scroller.refresh()
      },
      ...mapMutations({
        setRank:'SET_RANK'
      })
    },
    components: {
      BaseScroll,
      BaseLoading
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
