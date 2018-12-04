<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
  export default {
    name: 'MHeader'
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    display flex
    justify-content center
    height 44px
    color $color-theme
    font-size 0
    .icon
      bg-image('logo')
      width 30px
      height 32px
      background-size 30px 32px
      margin-top 6px
      margin-right 9px
    .text
      line-height 44px
      font-size $font-size-large
</style>
