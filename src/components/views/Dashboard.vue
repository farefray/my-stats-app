<template>
    <!-- Main content -->
    <section class="content">
        <!-- Main row -->
        <div class="row">
            <button @click="refreshChart()">Refresh</button>
            <line-example :chartdata="dataPoints"></line-example>
        </div>
        <!-- /.row -->
    </section>
    <!-- /.content -->
</template>

<script>
  // import Chart from 'chart.js'
  import api from '../../api'
  import store from '../../store'
  import LineExample from './charts/LineChart'

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
      refreshChart () {
        this.fillData()
      },
      fillData () {
        let labels = []
        let data = []
        let balance = 0
        for (let i = 0; i <= this.bets.length - 1; i++) {
            let bet = this.bets.reverse()[i]
            labels.push(bet.date)

            if (bet.status === 'win') {
              balance += bet.stake * bet.odds - bet.stake
            } else {
              balance -= bet.stake
            }

            data.push({value: balance, bet: bet})
        }

        this.dataPoints = {
          labels: labels,
          data: data,
          balance: balance
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
