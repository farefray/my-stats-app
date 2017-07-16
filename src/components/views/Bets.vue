<template>
  <section class="content">
    <div class="row center-block" v-if="action == 'display_bets'">
      <h2>Data tables</h2>
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Data Table With Full Features</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            Bets here
          </div>
        </div>
      </div>
      <div class="import-menu-bar row">
        <!--"Middle" type, four sub menu, animation introduced animate.css library, white mask, round custom switch button, default menu color configuration-->
        <circle-menu type="right" :number="2" animate="animated jello" mask='black' circle>
          <a slot="item_1" class="fa fa-plus fa-lg" data-toggle="tooltip" title="Store single bet" v-on:click="switchView('store_bet')"></a>
          <a slot="item_2" class="fa fa-plus fa-lg"></a>
        </circle-menu>
      </div>
    </div>
    <div class="row center-block" v-if="action == 'store_bet'">
      <store-bet v-on:done="switchView()"></store-bet>
   </div>
  </section>
</template>

<script>
import CircleMenu from 'vue-circle-menu'
import StoreBet from './bets/StoreBet'
import api from '../../api'

export default {
  name: 'Bets',
  data (router) {
    return {
      action: 'display_bets',
      storedBets: []
    }
  },
  components: {
    CircleMenu,
    StoreBet
  },
  mounted () {
    this.$nextTick(() => {
      this.updateBets()
    })
  },
  methods: {
    updateBets () {
      api.request('get', 'bets').then(response => {
          if (response.data) {
            this.storedBets = response.data
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
