<template>
  <div class="singer">

  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'

  export default {
    name: 'Singer',
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = res.data.list
            console.log(this.singerList)
          }
        })
      }
    },
    data () {
      return {
        singerList: []
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .singer
    position fixed
    width 100%
    top $top-height
    bottom 0
</style>
