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
    <AppChip v-for="app in getTrimmedAppList" :key="app.name" :app="app" />
    <v-slide-x-reverse-transition>
      <v-btn
    v-if="$store.state.account.filterByAppList.length"
        class="ms-1"
        color="error"
        small
        outlined
        rounded
        @click="removeFilterByApp('*')"
      >
        Clear
        <v-icon right>mdi-close</v-icon>
      </v-btn>
    </v-slide-x-reverse-transition>
  </v-row>
</template>

<script>
import { mapState, mapGetters,mapActions } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState("account", ["accountSearch"]),
    ...mapGetters("app", ["getAppList"]),
    getTrimmedAppList(){
      return this.getAppList().filter(e=>e.count>0)
    },
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
    ...mapActions('account', ['removeFilterByApp']),
    search(v) {
      this.$store.dispatch("account/setAccountSearch", v || "");
      this.isLoading = false;
    },
  },
};
</script>

<style>
</style>