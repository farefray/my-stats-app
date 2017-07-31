<template>
  <ag-grid-vue style="width: 100%; height: 350px;" class="ag-blue"
  :gridOptions="gridOptions"
  :columnDefs="columnDefs"
  :rowData="rowData"
  :rowDataChanged="rowDataChanged"
  v-if="active">
  </ag-grid-vue>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue'
import UIBet from '../../../../objects/uibet'
import {LicenseManager} from 'ag-grid-enterprise/main'
import Chrono from 'chrono-node'
import ParserCellComponent from './ParserCellComponent'
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
                } else if (value.toLowerCase().indexOf('starcraft 2') >= 0 || value.toLowerCase().indexOf('sc2') >= 0) {
                  currentData[i]['' + this.row + ''].type = key
                  currentData[i]['' + this.row + ''].value = 'dota 2'
                } else {
                  currentData[i]['' + this.row + ''].type = key
                  currentData[i]['' + this.row + ''].value = value.toLowerCase()
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

              case 'currency':
              case 'stake': {
                let stake = parseInt(value)
                if (stake > 0) {
                  currentData[i]['' + this.row + ''].value = stake
                  currentData[i]['' + this.row + ''].type = key

                  // lets guess currency
                  let currency = typeof value === 'string' ? value.split(' ')[1] : false
                  if (currency) {
                    currentData[i]['x'] = {}
                    currentData[i]['x'].value = currency
                    currentData[i]['x'].type = 'currency'
                    // add it to grid
                    // seems we need to store already parsed bets somewhere else, so we can just set values when changing
                    // two ways, first one is to hold bets in some other object and on this step we gonna fill it.
                    // second way is to add new column here and mark it as currency
                  }
                }
                break
              }

              default: {
                currentData[i]['' + this.row + ''].type = key
              }
            }
          }

          this.params.api.dispatchEvent('rowDataChanged')
        }
        // icon: '<img src="../images/lab.png" style="width: 14px;"/>'
    })
  })

  menuItems.push('resetColumns')
  return menuItems
}

var gridOptions = {
  getMainMenuItems: getMainMenuItems,
  customItem: 'test'
}

export default {
  name: 'RawPastedTable',
  props: ['rowData'],
  data () {
    return {
      gridOptions: gridOptions,
      columnDefs: [],
      elements: [],
      resultedBets: [],
      active: false
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  mounted: function () {
    console.log('mounted')
    this.rowDataChanged()
  },
  methods: {
    rowDataChanged () {
      console.log('rowdaachanged')
      let rows = this.rowData
      let longestElement = {}
      let parsedBets = []
      Object.keys(rows).forEach(function (key) {
        let rawBetData = rows[key]
        let newBet = new UIBet()
        newBet.fill(rawBetData)
        parsedBets.push(newBet)

        if (Object.keys(longestElement).length < Object.keys(rawBetData).length) {
          longestElement = rawBetData
        }
      })

      // lets first the longest, which supposed to be the one with max items
      var baseHeaders = []
      Object.keys(longestElement).forEach(function (key) {
        baseHeaders.push({
            headerName: 'select',
            field: key,
            cellRendererFramework: ParserCellComponent,
            menuTabs: ['generalMenuTab']
        })
      })

      this.columnDefs = baseHeaders
      if (Object.keys(longestElement).length > 0) {
        this.active = true
      }

      this.$emit('parsed', parsedBets)
    }
  }
}
</script>
