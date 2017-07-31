<template>
  <div>
    <ag-grid-vue style="width: 100%; height: 350px;" class="ag-blue"
    :gridOptions="gridOptions"
    :columnDefs="columnDefs"
    :rowData="bets"
    :rowDataChanged="rowDataChanged">
    </ag-grid-vue>
    <button class="btn btn-success" v-on:click="importBets()">Go</button>
  </div>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue'
import UIBet from '../../../../objects/uibet'
import {LicenseManager} from 'ag-grid-enterprise/main'
import api from '../../../../api'
LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')

var gridOptions = {}

export default {
  name: 'PreImportTable',
  props: ['parsedBets'],
  data () {
    return {
      gridOptions: gridOptions,
      columnDefs: [],
      elements: [],
      resultedBets: [],
      active: false,
      bets: []
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  mounted: function () {
    console.log('mounted preimport')
    console.log(this.parsedBets)
  },
  methods: {
    importBets () {
      for (var i = 0; i < this.bets.length; i++) {
        api.request('post', 'bets', this.bets[i]).then(response => {
            window.console.log(response)
            if (response.status === 200 && response.data && response.data._id) {
              this.$notify({
                title: 'Success action',
                type: 'success',
                text: 'Bet was imported',
                duration: 3000,
                speed: 1000
              })
            }
          })
          .catch(function (error) {
            this.$notify({
              title: 'Error action',
              type: 'error',
              text: 'Bet import failed',
              duration: 3000,
              speed: 1000
            })

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
            console.log(error.config)
          })
      }
    },
    rowDataChanged () {
      console.log('preimport')
      let newBet = new UIBet()
      var baseHeaders = []
      Object.keys(newBet).forEach(function (key) {
        baseHeaders.push({
            headerName: key,
            field: key,
            menuTabs: []
        })
      })

      this.columnDefs = baseHeaders
      this.bets = this.parsedBets
    }
  }
}
</script>
