<template>
  <div v-show="searches.length" class="search-list">
    <ul>
      <li v-for="item of searches" class="search-item">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'SearchList',
    props: {
      searches: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      .text
        flex 1
        color $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>
