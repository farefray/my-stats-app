<template>
    <!-- Main content -->
    <section class="content">
        <!-- Main row -->
        <div class="row">
            <button @click="doubleThis()">asdasd</button>
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
      doubleThis () {
        let labels = []
        let data = []
        let balance = 0
        for (let i = 0; i <= this.bets.length - 1; i++) {
          let bet = this.bets[i]
          labels.push(bet.date)

          if (bet.status === 'win') {
            balance += bet.stake * bet.odds - bet.stake + 20
          } else {
            balance -= bet.stake * bet.odds - bet.stake
          }
          data.push(balance)
        }

        this.dataPoints = {
          labels: labels,
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: data
            }
          ]
        }
      },
      fillData () {
        let labels = []
        let data = []
        let balance = 0
        for (let i = 0; i <= this.bets.length - 1; i++) {
            let bet = this.bets[i]
            labels.push(bet.date)

            if (bet.status === 'win') {
              balance += bet.stake * bet.odds - bet.stake
            } else {
              balance -= bet.stake * bet.odds - bet.stake
            }
            data.push(balance)
        }

        this.dataPoints = {
          labels: labels,
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: data
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
