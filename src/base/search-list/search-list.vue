<template>
  <div v-show="searches.length" class="search-list">
    <ul>
      <li v-for="item of searches"
          @click="onSelectHistory(item)"
          class="search-item"
      >
        <span class="text">{{item}}</span>
        <span @click.stop="onDeleteHistory(item)" class="icon">
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
    },
    methods: {
      onSelectHistory(item){
        this.$emit('selectHistory',item)
      },
      onDeleteHistory (item) {
        this.$emit('deleteHistory', item)
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
