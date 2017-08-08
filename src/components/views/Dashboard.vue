<template>
    <!-- Main content -->
    <section class="content">
        <!-- Main row -->
        <div class="row">
            <line-example :chart-data="dataPoints"></line-example>

        </div>
        <!-- /.row -->
    </section>
    <!-- /.content -->
</template>

<script>
  // import Chart from 'chart.js'
  import api from '../../api'
  import store from '../../store'
  import LineExample from './charts/LineChart.js'

  export default {
    name: 'Dashboard',
    data () {
      return {
        bets: null,
        dataPoints: null
      }
    },
    mounted () {
      this.$nextTick(() => {
        api.request('get', 'bets', {
          userid: store.state.username
        })
          .then(response => {
            this.bets = response.data
            console.log(this.bets)
            this.fillData()
          })
      })
    },
    methods: {
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      },
      fillData () {
        this.dataPoints = {
          labels: ['January' + this.getRandomInt(), 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [88, 77, this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
            }
          ]
        }
      }
    },
    components: {
      LineExample
    }
  }
</script>

<style>

</style>
