<template>
  <div class="d-flex justify-center my-4">
    <v-btn
      v-if="scrollAutoLoad"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="200"
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
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      busy: false,
      btnLoadMoreLoading: false,
    };
  },
  computed: {
    ...mapState("settings", ["scrollAutoLoad", "hoverToShowPw"]),
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