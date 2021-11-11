<template>
  <div class="fill-height d-flex justify-center" style="position:relative;">
    <v-scale-transition
      class="d-flex justify-center flex-wrap"
      group
      origin="center center"
    >
      <AccountListCardItem v-for="acc in data" :key="acc.id" :acc="acc" />
    </v-scale-transition>
    <div v-if="!data.length" class="d-flex" style="min-height: 300px;position:absolute;">
      <v-card class="ma-auto" elevation="0">
        <v-card-text class="d-flex flex-column text-center">
          <v-icon size="90">mdi-robot-confused</v-icon>
          <h3 class="font-weight-bold">No data found.</h3>
          <v-btn
            class="mt-4 font-weight-bold"
            outlined
            color="error"
            @click="resetSearch()"
          >
            Reset search
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
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
    resetSearch() {
      this.$store.dispatch("account/setAccountSearch", "");
    },
  },
};
</script>

<style>
</style>