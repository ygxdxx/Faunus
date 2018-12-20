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
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/songClz'
  import {playListMixin} from '../../common/js/mixin'

  export default {
    name: 'RankDetail',
    mixins: ['playListMixin'],
    created () {
      this._getMusicList()
    },
    data () {
      return {
        songs: []
      }
    },
    methods: {
      _getMusicList () {
        if(!this.rank.id){
          this.$router.push('/rank')
          return
        }
        getMusicList(this.rank.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._rebuildData(res.songlist)
          }
        })
      },
      _rebuildData (list) {
        let ret = []
        list.forEach((song) => {
          let musicData = song.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
    },
    components: {
      MusicList
    },
    computed: {
      ...mapGetters([
        'rank'
      ]),
      title () {
        return this.rank.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return this.rank.picUrl
      }
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)

</style>
