<template>
  <section class="parse-bets">
    <textarea mdInput v-model="raw" required v-on:blur="updateRaw()"
                     placeholder=""></textarea>
    <ag-grid-vue style="width: 100%; height: 350px;" class="ag-blue"
    :gridOptions="gridOptions"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :componentStateChanged="stateChanged"
    :columnEverythingChanged="stateChanged">
    </ag-grid-vue>
  </section>
</template>

<script>
// import UIBet from '../../../objects/uibet'
// import api from '../../../api'
import {LicenseManager} from 'ag-grid-enterprise/main'
import {AgGridVue} from 'ag-grid-vue'
// import ClickableParentComponent from './ClickableParentComponent'
LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')

function getMainMenuItems (params) {
  return [
      {
          name: 'Joe Abercrombie',
          action: function () {
            console.log('He wrote a book')
          },
          icon: '<img src="../images/lab.png" style="width: 14px;"/>'
      },
      {
          name: 'Larsson',
          action: function () {
            console.log('He also wrote a book')
          },
          checked: true
      },
      'resetColumns'
  ]
}

var gridOptions = {
  singleClickEdit: true,
  getMainMenuItems: getMainMenuItems
}

export default {
  name: 'ParseBets',
  data () {
    return {
      gridOptions: gridOptions,
      rowData: [],
      columnDefs: [],
      raw: `№ 1799775633
from 23.06.2017 | 21:57
Dota 2. The International. Best of 3 maps
ALLFAM - Planet Dog (2 map)
Stake
270 UAH
Win:
480.6 UAH
Bet type
Single
Bet slip status
Win
1.78
№ 1799758829
from 23.06.2017 | 21:52
Dota 2. The International. Best of 3 maps
ALLFAM - Planet Dog (2 map)
Stake
250 UAH
Win:
455 UAH
Bet type
Single
Bet slip status
Win
1.82`,
    selectedOptions: [],
    elements: []
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  beforeMount () {
  },
  methods: {
    stateChanged ($event) {
      console.log($event)
    },
    updateRaw () {
      const rowData = []
      this.selectedOptions = []
      let parsed = this.raw.split('\n')
      let fullElement = {}
      let first = null
      let letNumber = 97
      for (var i = 0; i <= parsed.length - 1; i++) {
        let el = parsed[i]
        if (first === null) {
          first = el
        } else if (el.length === first.length) {
          // thats new row
          rowData.push(fullElement)
          fullElement = {}
          letNumber = 97
        }

        fullElement[String.fromCharCode(letNumber)] = el
        letNumber++
      }

      rowData.push(fullElement) // last element

      var baseHeaders = []
      Object.keys(fullElement).forEach(function (key) {
        // let obj = fullElement[key];
        // this.selectedOptions[key] = 'none'
        baseHeaders.push({
            headerName: 'select',
            field: key
        })
      })

      console.log(rowData)
      console.log(baseHeaders)
      this.rowData = rowData
      this.columnDefs = baseHeaders
      }
  }
}
</script>

<style>

</style>
