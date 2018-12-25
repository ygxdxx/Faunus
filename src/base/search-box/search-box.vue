<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input v-model="query"
           :placeholder="placeholder"
           ref="searchInput"
           class="box"
    />
    <i v-show="query"
       @click="onDismissClick"
       class="icon-dismiss"
    >
    </i>
  </div>
</template>

<script>
  import {debounce} from 'common/js/until'

  export default {
    name: 'SearchBox',
    created () {
      //TODO 为什么watch事件不单独列出而是放在created中？
      this.$watch('query', debounce((queryVal) => {
        this.$emit('query', queryVal)
      }, 200))
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      onDismissClick () {
        this.query = ''
      },
      setQuery (val) {
        this.query = val
      },
      blur () {
        this.$refs.searchInput.blur()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
