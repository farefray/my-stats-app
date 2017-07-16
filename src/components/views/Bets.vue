<template>
  <section class="content">
    <div class="row center-block" v-if="action == 'display_bets'">
      <h2>My stored bets</h2>
      <!--"Middle" type, four sub menu, animation introduced animate.css library, white mask, round custom switch button, default menu color configuration-->
      <circle-menu type="right" :number="2" animate="animated jello" mask='black' circle>
        <a slot="item_1" class="fa fa-plus fa-lg" data-toggle="tooltip" title="Store single bet" v-on:click="switchView('store_bet')"></a>
        <a slot="item_2" class="fa fa-plus fa-lg"></a>
      </circle-menu>
      <div class="col-md-12">
        <div class="box">
          <div class="box-body">
            <ag-grid-vue style="width: 100%; height: 750px;" class="ag-fresh"
             :gridOptions="gridOptions"
             :columnDefs="columnDefs"
             :rowData="storedBets"
             :enableSorting="true">
            </ag-grid-vue>
          </div>
        </div>
      </div>
      <div class="import-menu-bar row">

      </div>
    </div>
    <div class="row center-block" v-if="action == 'store_bet'">
      <store-bet v-on:done="switchView()"></store-bet>
   </div>
  </section>
</template>

<script>
import '../../../node_modules/ag-grid/dist/styles/ag-grid.css'  // TODO resolve this dependancies
import '../../../node_modules/ag-grid/dist/styles/theme-fresh.css' // TODO resolve this dependancies
import {AgGridVue} from 'ag-grid-vue'
import ClickableParentComponent from './bets/ClickableParentComponent'

import CircleMenu from 'vue-circle-menu'
import StoreBet from './bets/StoreBet'
import api from '../../api'

export default {
  name: 'Bets',
  data (router) {
    return {
      action: 'display_bets',
      storedBets: null,
      gridOptions: null,
      columnDefs: null
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    CircleMenu,
    StoreBet
  },
  beforeMount () {
            this.gridOptions = {}
            this.createColumnDefs()
  },
  mounted () {
    this.$nextTick(() => {
      this.updateBets()
    })
  },
  methods: {
    createColumnDefs () {
        this.columnDefs = [
            {
                headerName: 'Id',
                field: 'id',
                width: 100,
                headerComponentParams: {
                    menuIcon: 'fa-bars'
                }
            },
            {
                headerName: 'Date',
                field: 'date',
                width: 150
            },
            {
                headerName: 'Type',
                field: 'type',
                width: 150
            },
            {
                headerName: 'Odds',
                field: 'odds',
                width: 150
            },
            {
                headerName: 'Stake',
                field: 'stake',
                width: 150
            },
            {
                headerName: 'Status',
                field: 'status',
                width: 150
            },
            {
                headerName: 'Clickable Component',
                field: 'name',
                cellRendererFramework: ClickableParentComponent,
                width: 250
            }
        ]
    },
    updateBets () {
      let _this = this
      api.request('get', 'bets').then(response => {
          if (response.data) {
            _this.storedBets = response.data
          }
        })
    },
    switchView (act) {
      console.log('switchView')
      this.action = act !== undefined ? act : 'display_bets'
      if (this.action === 'display_bets') {
        this.updateBets()
      }
    }
  }
}
</script>

<style>
@CircleMenuBtnColor: #324234;
@CircleMenuItem1Color: #00e676;
@CircleMenuItem2Color: #ffa000;

#CircleMenu {
  position:absolute;
  bottom: 75px;
  right: 1%;
  margin:0;
  padding:5px 3px;
}

</style>
