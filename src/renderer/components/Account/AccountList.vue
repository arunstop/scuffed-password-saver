<template>
  <div style="position: relative; min-height: 100vh">
    <!-- Searchbar and app filter -->
    <LazyAccountSearch v-if="accountList.length" :data="pagedAccountList" />
    <!-- Account selection -->
    <LazyAccountListSelection
      v-if="accountList.length"
      :data="pagedAccountList"
    />
    <!-- Total items indicator -->
    <v-alert
      v-if="pagedAccountList.length"
      class="mt-2 font-weight-bold"
      text
      type="info"
    >
      {{ totalItemsIndicator }}
    </v-alert>
    <!-- No data template -->
    <v-slide-y-transition class="row my-4 no-gutters" leave-absolute group>
      <v-card
        v-if="!pagedAccountList.length"
        key="al-nodata"
        class="mx-auto"
        elevation="0"
      >
        <v-card-text
          v-if="$store.state.account.accountList.length"
          class="d-flex flex-column text-center"
        >
          <v-icon size="90">mdi-robot-confused</v-icon>
          <h3 class="font-weight-bold">No matches were found.</h3>
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
        <v-card-text v-else class="d-flex flex-column text-center">
          <v-icon size="90">mdi-robot-confused</v-icon>
          <h3 class="font-weight-bold">You account list is currently empty.</h3>
          <v-btn
            class="text-none mt-4 font-weight-bold"
            outlined
            color="primary"
            @click="openAccountAddDialog()"
          >
            Add an account
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <h3 class="font-weight-bold mt-2">OR</h3>
          <v-btn
            class="text-none mt-2 font-weight-bold"
            outlined
            color="primary"
            @click="showImportDialog()"
          >
            Import accounts
            <v-icon right>mdi-download-multiple</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
      <v-fade-transition
        v-else
        key="al-view"
        hide-on-leave
        group
        class="col col-12"
      >
        <LazyAccountListTable
          v-if="$store.state.settings.accListView === 'table'"
          :key="'al-table'"
          :data="pagedAccountList"
        />
        <LazyAccountListCard
          v-else-if="$store.state.settings.accListView === 'card'"
          :key="'al-card'"
          :data="pagedAccountList"
        />
      </v-fade-transition>
    </v-slide-y-transition>
    <!-- More items Loader -->
    <LazyAccountListLoader
      v-if="!lastPage"
      :items-left="rawAccountList.length - pagedAccountList.length"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
export default {
  computed: {
    ...mapGetters("account", ["getAccountList"]),
    ...mapState("ui/accountList", [
      "sortByValue",
      "sortByList",
      "orderValue",
      "paging",
    ]),
    ...mapState("settings", ["scrollAutoLoad"]),
    ...mapState("account", ["accountList"]),
    rawAccountList() {
      return  this.getAccountList().map((e) => {
        // adding pw durability
        return { ...e, durab: this.pwDurab(e.editedPw) };
      });
      // return _.sortBy(sal, [this.sortByValue.val]);
    },
    pagedAccountList() {
      
      const sal = _.sortBy(this.rawAccountList, [this.sortByValue.val]);
      // const sal = this.rawAccountList;
      // console.log(sorted.map(e=>({accId:e.accountId,date:e.edited})))
      const dataSum = this.paging.page * this.paging.count;
      const paged = (
        this.orderValue.val === "desc" ? sal.reverse() : sal
      ).slice(0, dataSum);
      return paged;
    },
    lastPage() {
      return (
        this.paging.page * this.paging.count >= this.getAccountList().length
      );
    },
    totalItemsIndicator() {
      const total = this.rawAccountList.length;
      const tPaged = this.pagedAccountList.length;
      const itemLabel = () => " item" + (tPaged > 1 ? "s" : "");

      if (total === tPaged)
        return "Showing all " + total + itemLabel() + " found";
      return "Showing " + tPaged + " out of " + total + itemLabel() + " found";
    },
  },
  methods: {
    pwDurab(edited) {
      return this.$globals.getPwDurability(
        edited,
        this.$store.state.settings.reminderFreq
      );
    },
    ...mapActions("ui", ["toggleDialog"]),
    resetSearch() {
      this.$store.dispatch("account/setAccountSearch", "");
    },
    openAccountAddDialog() {
      this.toggleDialog({ type: "ACCOUNT_ADD_DIALOG", val: true });
    },
    showImportDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: "IMPORT_DIALOG",
        val: true,
      });
    },
  },
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
.selection-opt {
  position: -webkit-sticky;
  position: sticky;
  top: -1px;
  z-index: 100;
}
.primary-t {
  background-color: var(--v-primary-base) !important;
  transition: 0.6s;
}
/* .selection-opt-pinned{
  border-left: thin var(--v-primary-base) solid !important;
  border-bottom: thin var(--v-primary-base) solid !important;
} */
</style>
