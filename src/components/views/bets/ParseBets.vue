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
import UIBet from '../../../objects/uibet'
// import api from '../../../api'
import {LicenseManager} from 'ag-grid-enterprise/main'
import {AgGridVue} from 'ag-grid-vue'
// import ClickableParentComponent from './ClickableParentComponent'
import ParserCellComponent from './ParserCellComponent'
import Chrono from 'chrono-node'
LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')

function getMainMenuItems (params) {
  let betExample = new UIBet()
  let menuItems = []
  console.log(params)
  Object.keys(betExample).forEach(function (key) {
    menuItems.push({
        name: key,
        row: params.column.colId,
        params: params,
        action: function (p) {
          console.log(this.row + ' picked ' + key)
          console.log(this)
          let currentData = this.params.api.gridCore.gridOptions.rowData
          for (var i = 0; i <= currentData.length - 1; i++) {
            let value = currentData[i]['' + this.row + ''].value
            switch (key) {
              case 'date': {
                let validateDate = Chrono.parse(value)
                let formattedValue = ''
                if (validateDate.length > 0) {
                  for (var j = 0; j <= validateDate.length - 1; j++) {
                    formattedValue += validateDate[j].text
                  }

                  currentData[i]['' + this.row + ''].type = key
                  currentData[i]['' + this.row + ''].value = (formattedValue)
                  console.log(Date.parse(Chrono.parseDate(currentData[i]['' + this.row + ''].value)))
                } else {
                  console.log('failed')
                }

                break
              }

              case 'discipline': {
                if (value.toLowerCase().indexOf('dota 2') >= 0 || value.toLowerCase().indexOf('dota2') >= 0) {
                  currentData[i]['' + this.row + ''].type = key
                  currentData[i]['' + this.row + ''].value = 'dota 2'
                } else {
                  console.log('failed')
                }

                break
              }

              case 'participants': {
                let participants = value.split(' - ')
                let participantsArray = []
                participants.forEach(function (key) {
                  participantsArray.push(key.split('(')[0].trim())
                })

                currentData[i]['' + this.row + ''].value = participantsArray
                currentData[i]['' + this.row + ''].type = key
                break
              }

              default: {
                currentData[i]['' + this.row + ''].type = key
              }
            }
          }
        }
        // icon: '<img src="../images/lab.png" style="width: 14px;"/>'
    })
  })

  menuItems.push('resetColumns')
  return menuItems
}

var gridOptions = {
  getMainMenuItems: getMainMenuItems
}

function parcerCellFormatter (params) {
    console.log(params)
    return (params.value)
}

export default {
  name: 'ParseBets',
  data () {
    return {
      gridOptions: gridOptions,
      rowData: [],
      columnDefs: [],
      raw: `№ 1862910769
from 17.07.2017 | 12:41
Dota 2. World Cyber Arena. Qualification. Best of 3 maps
Execration - Rex Regum Qeon (1 map)
Stake
250 UAH
Bet type
Single
Bet slip status
Loss
2.37
№ 1862672859
from 17.07.2017 | 10:26
Dota2. WCA Quali
Execration - RRQ
Stake
250 UAH
Win:
326 UAH
Bet type
Accumulator
Bet slip status
Win
1.304
№ 1861388995
from 16.07.2017 | 19:20
Dota 2. Overpower Cup. Best of 3 maps
PENTA - dd
Stake
250 UAH
Bet type
Single
Bet slip status
Loss
2.56`,
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
      let parsed = this.raw.split('\n')
      let fullElement = {}
      let first = null
      let letNumber = 97
      let longestElement = {}

      for (var i = 0; i <= parsed.length - 1; i++) {
        let el = parsed[i]
        if (first === null) {
          first = el
        } else if (el.length === first.length) {
          // thats new row
          // TODO what if next row assidently is same length
          rowData.push(fullElement)
          if (Object.keys(longestElement).length < Object.keys(fullElement).length) {
            longestElement = fullElement
          }

          fullElement = {}
          letNumber = 97
        }

        fullElement[String.fromCharCode(letNumber)] = {value: el, type: 'none'}
        letNumber++
      }

      rowData.push(fullElement) // last element

      // lets first the longest, which supposed to be the one with max items
      var baseHeaders = []
      Object.keys(longestElement).forEach(function (key) {
        baseHeaders.push({
            headerName: 'select',
            field: key,
            cellRendererFramework: ParserCellComponent,
            valueFormatter: parcerCellFormatter,
            menuTabs: ['generalMenuTab']
        })
      })

      console.log(rowData)
      console.log(baseHeaders)
      console.log(longestElement)
      this.rowData = rowData
      this.columnDefs = baseHeaders
      }
  }
}
</script>

<style>

</style>
