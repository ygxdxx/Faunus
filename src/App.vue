<template>
  <div id="app">
    <m-header/>
    <tabs></tabs>
    <router-view/>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tabs from 'components/tabs/tabs'

  export default {
    name: 'App',
    components: {
      MHeader,
      Tabs
    }
  }
</script>

<style scoped lang="stylus">
</style>
