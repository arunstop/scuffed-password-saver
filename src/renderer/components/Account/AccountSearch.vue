<template>
  <div class="pt-4">
    <v-alert v-if="getUnlistedApp().length" type="warning" border="left" text icon="mdi-alert-circle">
      Some applications/websites for the accounts might not be listed in the
      system yet.
      <br />
      <v-btn class="mt-2" color="primary" @click="completeListing()">
        Complete Listing
        <v-icon right>mdi-check</v-icon>
      </v-btn>
    </v-alert>
    <v-row class="" no-gutters align="center">
      <v-text-field
        ref="accSearchInput"
        v-model.lazy="accountSearchModel"
        :value="accountSearch"
        class="col-6 me-1"
        outlined
        label="Search : ctrl + f or /"
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
          class="ms-1 font-weight-black"
          color="error"
          small
          outlined
          rounded
          @click="removeFilterByApp('*')"
        >
          Clear
          <v-icon right>mdi-close-thick</v-icon>
        </v-btn>
      </v-slide-x-reverse-transition>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState("account", ["accountSearch"]),
    ...mapGetters("app", ["getAppList", "getAppListByAccount", "getUnlistedApp"]),
    getTrimmedAppList() {
      return this.getAppListByAccount();
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
  mounted() {
    window.addEventListener("keydown", (e) => {
      if ((e.key === "f" && e.ctrlKey) || e.key === "/") {
        e.preventDefault();
        this.$refs.accSearchInput.focus();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", (e) => {});
  },
  methods: {
    ...mapActions("account", ["removeFilterByApp"]),
    search(v) {
      this.$store.dispatch("account/setAccountSearch", v || "");
      this.isLoading = false;
    },
    completeListing(){
      this.getUnlistedApp().forEach(e=>{
        this.$store.dispatch("app/addApp", {
          name: e.name,
          urls: "",
        });
      })
    }
  },
};
</script>

<style>
</style>