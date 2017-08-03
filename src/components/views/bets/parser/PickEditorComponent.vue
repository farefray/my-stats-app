<template>
    <div :ref="'container'" class="mood" tabindex="0">
        <span v-for="item in items" @click="onClick(item)" >
            {{ item }}
        </span>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default Vue.extend({
        data () {
            return {
                items: [],
                value: ''
            }
        },
        methods: {
            getValue () {
                return this.value
            },
            isPopup () {
                return true
            },
            onClick (val) {
                this.value = val
                this.params.api.stopEditing()

                // set winners or losers
                let thisBet = this.params.api.gridCore.gridOptions.rowData[this.params.rowIndex]
                thisBet.winners = []
                for (let i = 0; i <= thisBet.participants.length - 1; i++) {
                    if (thisBet.status.toLowerCase() === 'win' && thisBet.participants[i] === val) {
                        thisBet.winners.push(thisBet.participants[i])
                    } else if (thisBet.status.toLowerCase() === 'loss' && thisBet.participants[i] !== val) {
                        thisBet.winners.push(thisBet.participants[i])
                    }
                }
            }
         },
        created () {
            let thisBet = this.params.api.gridCore.gridOptions.rowData[this.params.rowIndex]
            this.items = thisBet.participants
            console.log(this.items)
            console.log('created')
        },
        mounted () {
            Vue.nextTick(() => {
                this.$refs.container.focus()
                let thisBet = this.params.api.gridCore.gridOptions.rowData[this.params.rowIndex]
                this.items = thisBet.participants
                console.log('mounted')
            })
        }
    })
</script>


<style scoped>
    .mood {
        border-radius: 15px;
        border: 1px solid grey;
        background: #e6e6e6;
        padding: 15px;
        text-align: center;
        display: inline-block;
        outline: none
    }
    .mood > span {
        padding: 5px;
    }
</style>