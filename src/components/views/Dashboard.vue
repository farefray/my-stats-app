<template>
    <!-- Main content -->
    <section class="content">
        <!-- Main row -->
        <div class="row">


        </div>
        <!-- /.row -->
    </section>
    <!-- /.content -->
</template>

<script>
  // import Chart from 'chart.js'
  import api from '../../api'
  import store from '../../store'

  export default {
    name: 'Dashboard',
    data () {
      return {
        bets: null
      }
    },
    computed: {},
    mounted () {
      this.$nextTick(() => {
        api.request('get', 'bets', {
          userid: store.state.username
        })
          .then(response => {
            this.bets = response.data
            console.log(this.bets)
          })
      })
    }
  }
</script>

<style>

</style>
