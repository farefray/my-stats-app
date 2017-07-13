<template>
  <section class="content">
    <div class="row center-block">
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
    </div>
    <div class="import-menu-bar row">
      <!--"Middle" type, four sub menu, animation introduced animate.css library, white mask, round custom switch button, default menu color configuration-->
      <circle-menu type="right" :number="2" animate="animated jello" mask='black' circle>
        <button type="button" slot="item_btn"></button>
        <a slot="item_1" class="fa fa-twitter fa-lg"></a>
        <a slot="item_2" class="fa fa-weixin fa-lg"></a>
      </circle-menu>
    </div>
  </section>
</template>

<script>
import CircleMenu from 'vue-circle-menu'

export default {
  name: 'Bets',
  components: {
    CircleMenu
  },
  mounted () {
    this.$nextTick(() => {

    })
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
