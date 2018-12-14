<template>
  <div id="app">
    <m-header/>
    <tabs></tabs>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player/>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tabs from 'components/tabs/tabs'
  import Player from 'components/player/player'

  export default {
    name: 'App',
    components: {
      MHeader,
      Tabs,
      Player
    }
  }
</script>

<style scoped lang="stylus">
</style>
