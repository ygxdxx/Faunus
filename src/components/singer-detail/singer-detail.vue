<template>
  <transition name="slide">
    <music-list
      :songs="songs"
      :title="title"
      :bgImage="bgImage"
    />
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/songClz'
  import MusicList from 'components/music-list/music-list'

  export default {
    name: 'SingerDetail',
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail () {
        //刷新的时候没有singer.id，因为singer并没有将某一个singer对象传给这个页面
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._buildSongsData(res.data.list)
          }
        })
      },
      _buildSongsData (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            let singerItem = createSong(musicData)
            ret.push(singerItem)
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
