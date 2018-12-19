<template>
  <transition name="slide">
    <music-list :title="title"
                :bgImage="bgImage"
                :songs="songs"
    />
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getDiscSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createDiscSong} from 'common/js/songClz'

  export default {
    name: 'Disc',
    created () {
      this._getDiscSongList()
    },
    data () {
      return {
        songs: []
      }
    },
    methods: {
      _getDiscSongList () {
        //刷新的时候没有disc.dissid，因为recommend并没有将某一个disc对象传给这个页面
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getDiscSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log('recommend disc：', res.cdlist[0].songlist)
            this.songs = this._buildDiscData(res.cdlist[0].songlist)
          }
        })
      },
      _buildDiscData (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.id && musicData.album) {
            ret.push(createDiscSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)
</style>
