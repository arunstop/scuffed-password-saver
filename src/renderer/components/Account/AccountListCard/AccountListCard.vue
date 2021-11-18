<template>
  <div class="fill-height" style="position: relative; min-height: 100vh">
    <div class="d-flex justify-center">
      <v-scale-transition
        v-if="data.length"
        class="row no-gutters justify-center flex-wrap"
        style="min-width: 100%; height: min-content"
        group
        origin="center center"
        hide-on-leave
      >
        <AccountListCardItem v-for="acc in data" :key="acc.id" :acc="acc" />
      </v-scale-transition>
    </div>
    <div v-if="!lastPage" class="d-flex justify-center my-4">
      <v-btn
        v-if="scrollAutoLoad"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        :loading="busy"
        x-large
        class="transparent primary--text"
        outlined
      >
        Load
      </v-btn>

      <v-btn
        v-else-if="!scrollAutoLoad"
        color="primary"
        :loading="btnLoadMoreLoading"
        @click="goToNextPage()"
      >
        Load More
        <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      busy: false,
      btnLoadMoreLoading: false,
    };
  },
  computed: {
    ...mapState("ui/accountList", ["paging", "count"]),
    ...mapState("account", ["accountList"]),
    ...mapState("settings", ["scrollAutoLoad"]),
    sortedList() {
      return this.data;
    },
    lastPage() {
      return this.paging.page * this.paging.count >= this.accountList.length;
    },
  },
  methods: {
    ...mapActions("ui/accountList", ["nextPage"]),
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.nextPage();
        this.busy = false;
      }, 1111);
    },
    goToNextPage() {
      this.btnLoadMoreLoading = true;
      setTimeout(() => {
        this.nextPage();
        this.btnLoadMoreLoading = false;
      }, 1111);
    },
  },
};
</script>

<style>
</style>
