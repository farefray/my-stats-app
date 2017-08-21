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

  function parseDate (timestamp) {
      let date = new Date(timestamp * 1000)
      return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join('/')
  }

  export default {
    name: 'Dashboard',
    data () {
      return {
        bets: null,
        dataPoints: null
      }
    },
    mounted () {
      setTimeout(this.loadBets()
      , 100)
    },
    methods: {
      loadBets () {
        api.request('get', 'bets', {
          userid: store.state.username
        }).then(response => {
          this.bets = response.data
          console.log(this.bets)
          this.fillData()
        }).catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
          console.log(error)
        })
      },
      refreshChart () {
        this.loadBets()
      },
      fillData () {
        let labels = []
        let data = []
        let balance = 0
        for (let i = 0; i <= this.bets.length - 1; i++) {
            let bet = this.bets.reverse()[i]
            labels.push(parseDate(bet.date))

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
