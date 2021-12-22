<template>
  <div class="fill-height" >
    <div class="d-flex justify-center">
      <v-scale-transition
        v-if="data.length"
        class="row no-gutters justify-center flex-wrap"
        style="min-width: 100%; height: min-content"
        group
        origin="center center"
        hide-on-leave
      >
        <AccountListCardBigItem v-for="acc in data" :key="acc.id" :acc="acc" />
      </v-scale-transition>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    data: { type: Array, default: () => [] },
  },
  computed: {
      sortedList() {
      return this.data;
    },
    
  },
  methods: {
    
  },
};
</script>

<style>
</style>
