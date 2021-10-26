<template>
  <v-row class="pt-4" no-gutters align="center">
    <v-text-field
      v-model.lazy="accountSearchModel"
      :value="accountSearch"
      class="col-6 me-1"
      outlined
      label="Search"
      placeholder="App / Email / ID / Username..."
      prepend-icon="mdi-magnify"
      clearable
      dense
      hide-details
      :loading="isLoading"
    >
    </v-text-field>
    <AppChip v-for="app in getAppList()" :key="app.name" :app="app" />
  </v-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState("account", ["accountSearch"]),
    ...mapGetters("app", ["getAppList"]),
    accountSearchModel: {
      get() {
        return "";
      },
      set(v) {
        this.isLoading = true;
        if (!v) {
          this.search(v);
        } else {
          this.$globals.lodash.debounce(() => {
            this.search(v);
          }, 1000)();
        }
      },
    },
  },
  methods: {
    search(v) {
      this.$store.dispatch("account/setAccountSearch", v || "");
      this.isLoading = false;
    },
  },
};
</script>

<style>
</style>