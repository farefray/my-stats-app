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
          for (let i = 0; i <= currentData.length - 1; i++) {
            let value = currentData[i]['' + this.row + ''].value
            let validated = betExample.validate(key, value)
            if (validated !== false) {
              currentData[i]['' + this.row + ''] = betExample.validate(key, value)
            } else {
              // Error need to be displayed
              console.log('Field not validated')
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
  getMainMenuItems: getMainMenuItems
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
      active: false,
      longestElement: null
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  mounted: function () {
    console.log('mounted')
    this.rowDataChanged()

    if (this.longestElement !== null) {
      // lets try to auto recognize fields
      console.log(this.rowData)
      let betExample = new UIBet()
      let _this = this
      Object.keys(this.longestElement).forEach(function (key) {
        Object.keys(betExample).forEach(function (kkey) {
          // TODO
          // validate every field for every possible value and set it (if not yet set)
          let validated = betExample.validate(kkey, _this.longestElement[key].value, true)
          if (validated !== false) {
            // currentData[i][key] = validated
            // currentData[i]['' + this.row + ''] = betExample.validate(key, value)
            console.log('VALIDATED' + kkey)
            console.log(_this.longestElement[key])
            console.log(validated)
          }
        })
      })
    }
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

      this.longestElement = longestElement
      console.log(parsedBets)
      this.$emit('parsed', parsedBets)
    }
  }
}
</script>
