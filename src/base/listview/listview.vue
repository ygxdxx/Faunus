<template>
  <base-scroll :data="data" class="listview">
    <ul class="list-group">
      <li
        v-for="outerItem of data"
        :key="outerItem.title"
      >
        <h2 class="list-group-title">{{outerItem.title}}</h2>
        <ul>
          <li
            v-for="innerItem of outerItem.items"
            :key="innerItem.id"
            class="list-group-item"
          >
            <img
              v-lazy="innerItem.avatar"
              class="avatar"
            >
            <p
              v-html="innerItem.name"
              class="name"
            >
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </base-scroll>
</template>

<script>
  import BaseScroll from 'base/scroll/scroll'

  export default {
    name: 'BaseListview',
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      BaseScroll
    },
    methods: {},
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        margin-top 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
