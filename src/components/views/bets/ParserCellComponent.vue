<template>
    <div :class="params.value.type" v-if="params.value">
      <span v-if="params.value.type == 'participants'">
        <span v-for="elem in params.value.value" :key="elem.key">
          [ {{elem}} ]
        </span>
      </span>
      <span v-else>
      {{params.value.value}}
      </span>
      <span class="label label-success" v-if="params.value.type != 'none'" >{{params.value.type}}</span>
      <span class="label label-success" v-if="params.value.type === 'none'" >{{params.value.similarity}}</span>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default Vue.extend({
        data () {
            return {
                smt: 'none'
            }
        },
        mounted () {
          // console.log(this.params)
        },
        methods: {
        }
    })
</script>

<style scoped>
div.none {
  color:red;
}

.label {
    position: absolute;
    right: 10px;
}
</style>
