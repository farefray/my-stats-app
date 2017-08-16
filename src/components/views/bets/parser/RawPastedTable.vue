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
const bows = require('bows')
LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')
var log = bows('RawPastedTable')

export default {
  name: 'RawPastedTable',
  props: ['rowData'],
  data () {
    return {
      longestElement: null,
      gridOptions: {
        getMainMenuItems: function (params) {
          let betExample = new UIBet()
          let menuItems = []
          Object.keys(betExample).forEach(function (key) {
            menuItems.push({
                name: key,
                row: params.column.colId,
                params: params,
                action: function () {
                  let currentData = this.params.api.gridCore.gridOptions.rowData
                  for (let i = 0; i <= currentData.length - 1; i++) {
                    let value = currentData[i]['' + this.row + ''].value
                    let validated = betExample.validate(key, value)
                    if (validated !== false) {
                      console.log(this.row)
                      currentData[i]['' + this.row + ''] = betExample.validate(key, value)
                    } else {
                      // Error need to be displayed
                      console.log('Field not validated')
                    }
                  }

                  this.params.api.dispatchEvent('rowDataChanged')
                }
            })
          })

          return menuItems
        }
      },
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
    this.updateHeaders()
    this.rowDataChanged()
    this.autoValidate()
  },
  methods: {
    autoValidate () {
      let betExample = new UIBet()
      let alreadyValidated = []
      let letNumber = 97
      let _this = this
      let newHeaders = this.columnDefs
      for (let i = 0; i < this.columnDefs.length; i++) {
        let key = this.columnDefs[i].key
        let letteredIndex = String.fromCharCode(letNumber)
        let tryingToValidate = this.longestElement[letteredIndex].value
        Object.keys(betExample).forEach(function (kkey) {
          // validate every field for every possible value and set it (if not yet set)
          if (alreadyValidated.indexOf(kkey) === -1 && _this.longestElement[letteredIndex].type === 'none') {
            let validated = betExample.validate(kkey, tryingToValidate, true)
            if (validated !== false) {
              for (let j = 0; j <= _this.rowData.length - 1; j++) {
                if (_this.rowData[j][letteredIndex].type === 'none') {
                  _this.rowData[j][letteredIndex] = betExample.validate(kkey, _this.rowData[j][letteredIndex].value, true)
                  newHeaders[j]['headerName'] = kkey
                }
              }

              alreadyValidated.push(kkey)
            }
          }
        })

        letNumber++
      }

      log(newHeaders)
      this.columnDefs = newHeaders
      this.gridOptions.columnDefs = newHeaders
    },
    updateHeaders () {
      let rows = this.rowData
      let longestElement = {}
      Object.keys(rows).forEach(function (key) {
        let rawBetData = rows[key]

        if (Object.keys(longestElement).length < Object.keys(rawBetData).length) {
          longestElement = rawBetData
        }
      })

      // lets first the longest, which supposed to be the one with max items
      //  also lets try to auto recognize fields
      var baseHeaders = []
      Object.keys(longestElement).forEach(function (key) {
        let header = {
          headerName: 'select',
          field: key,
          cellRendererFramework: ParserCellComponent,
          menuTabs: ['generalMenuTab']
        }

        baseHeaders.push(header)
      })

      if (Object.keys(longestElement).length > 0) {
        this.longestElement = longestElement
        this.columnDefs = baseHeaders
      }
    },
    rowDataChanged () {
      console.log('rowdaachanged')
      let rows = this.rowData
      let parsedBets = []
      Object.keys(rows).forEach(function (key) {
        let rawBetData = rows[key]
        let newBet = new UIBet()
        newBet.fill(rawBetData)
        parsedBets.push(newBet)
      })

      console.log(parsedBets)
      this.updateHeaders()
      this.active = true
      this.$emit('parsed', parsedBets)
    }
  }
}
</script>
