<template>
  <div style="height: 100%">
    <div class="pt-4">
      <v-expand-transition>
        <v-alert
          v-if="getUnlistedApp().length"
          type="warning"
          border="left"
          text
          icon="mdi-alert-circle"
        >
          Some applications/websites for the accounts might not be listed in the
          system yet.
          <br />
          <v-btn
            class="mt-2"
            color="primary"
            @click="completeAppListing(getUnlistedApp())"
          >
            Complete Listing
            <v-icon right>mdi-check</v-icon>
          </v-btn>
        </v-alert>
      </v-expand-transition>
      <v-row class="" no-gutters align="center">
        <v-text-field
          ref="accSearchInput"
          v-model="accountSearchModel"
          class="me-1"
          outlined
          label="Search : ctrl + f or /"
          placeholder="App / Email / ID / Username..."
          prepend-inner-icon="mdi-magnify"
          clearable
          dense
          hide-details
          :loading="isLoading"
          @input="debounceSearch"
        />
        <v-row class="ms-2" no-gutters>
          <v-chip
            v-for="view in $store.state.ui.accViewOptList"
            :key="view.value"
            class="mx-2"
            :outlined="$store.state.settings.accListView !== view.value"
            :color="
              $store.state.settings.accListView === view.value ? 'primary' : ''
            "
            label
            :title="view.label"
            @click="setAccListView(view.value)"
          >
            <v-icon>{{ view.icon }}</v-icon>
          </v-chip>
        </v-row>
      </v-row>
      <v-row no-gutters class="mt-2">
        <AppChip v-for="app in getTrimmedAppList" :key="app.name" :app="app" />
        <v-slide-x-reverse-transition>
          <v-btn
            v-if="$store.state.account.filterByAppList.length"
            class="ms-1 my-auto font-weight-black"
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      isLoading: false,
      debounce: null,
    };
  },
  computed: {
    ...mapState("account", ["accountSearch"]),
    ...mapGetters("app", [
      "getAppList",
      "getAppListByAccount",
      "getUnlistedApp",
    ]),
    getTrimmedAppList() {
      return this.getAppListByAccount();
    },
    accountSearchModel: {
      get() {
        return this.accountSearch || "";
      },
      set(v) {},
    },
  },
  mounted() {
    // Detect keydown
    window.addEventListener("keydown", this.keydown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keydown);
  },
  methods: {
    ...mapActions("account", ["removeFilterByApp"]),
    ...mapActions("app", ["completeAppListing"]),
    ...mapActions("settings", ["setAccListView"]),
    search(v) {
      this.$store.dispatch("account/setAccountSearch", v || "");
      this.isLoading = false;
    },
    keydown(event) {
      // IF not in home page
      // AND there is dialog
      // THEN keydown does nothing
      if (
        this.$nuxt.$route.name !== "index" ||
        this.$store.state.ui.dialogList.length
      ) {
        return;
      }

      // ctrl+f or /
      if ((event.key === "f" && event.ctrlKey) || event.key === "/") {
        event.preventDefault();
        this.$refs.accSearchInput.focus();
      }
    },
    debounceSearch(value) {
      if (value === null) {
        this.search(value);
        return;
      }
      this.isLoading = true;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.search(value);
      }, 600);
    },
  },
};
</script>

<style>
</style>
