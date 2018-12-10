<template>
  <div class="singer-detail">
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'

  export default {
    name: 'SingerDetail',
    computed: {
      ...mapGetters([
        'singer' //这是一个singer对象作为返回值
      ])
    },
    created () {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail () {
        if(!this.singer.id){
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
</style>
