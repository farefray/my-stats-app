<template>
  <div id="app">
    <notifications position="top right"></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        section: 'Head'
      }
    },
    methods: {

    }
  }
</script>


<style>
</style>
