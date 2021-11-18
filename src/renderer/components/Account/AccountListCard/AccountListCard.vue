<template>
  <div
    class="fill-height d-flex justify-center"
    style="position: relative; min-height: 100vh"
  >
    <v-scale-transition
    v-if="data.length"
      class="row no-gutters justify-center flex-wrap"
      style="min-width: 100%; height:min-content;"
      group
      origin="center center"
      hide-on-leave
    >
      <AccountListCardItem v-for="acc in data" :key="acc.id" :acc="acc" />
    </v-scale-transition>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  props: {
    data: { type: Array, default: () => [] }
  },
  computed: {
    sortedList () {
      return this.data
    }
  },
  methods: {
    
  }
}
</script>

<style>
</style>
