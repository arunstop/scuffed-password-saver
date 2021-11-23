<template>
  <div style="position: relative; min-height: 100vh">
    <LazyAccountSearch :data="sortedAccountList" />
    
    <LazyAccountListSelection :data="sortedAccountList" />
    <v-slide-y-transition class="row" leave-absolute group>
      <v-card
        v-if="!sortedAccountList.length"
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
            class="mt-4 font-weight-bold"
            outlined
            color="primary"
            @click="openAccountAddDialog()"
          >
            Add Account
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <h3 class="font-weight-bold mt-2">OR</h3>
          <v-btn
            class="mt-2 font-weight-bold"
            outlined
            color="primary"
            @click="showImportDialog()"
          >
            Import Accounts
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
          :data="sortedAccountList"
        />
        <LazyAccountListCard
          v-else-if="$store.state.settings.accListView === 'card'"
          :key="'al-card'"
          :data="sortedAccountList"
        />
      </v-fade-transition>
    </v-slide-y-transition>
    <LazyAccountListLoader v-if="!lastPage" />
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
    
    sortedAccountList() {
      const sal = this.getAccountList().map((e) => {
        // adding pw durability
        return { ...e, durab: this.pwDurab(e.editedPw) };
      });
      const sorted = _.sortBy(sal, [this.sortByValue.val]);
      // console.log(sorted.map(e=>({accId:e.accountId,date:e.edited})))
      const dataSum = this.paging.page * this.paging.count;
      const paged = (
        this.orderValue.val === "desc" ? sorted.reverse() : sorted
      ).slice(0, dataSum);
      return paged;
    },
    lastPage() {
      return (
        this.paging.page * this.paging.count >= this.getAccountList().length
      );
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
    showImportDialog () {
      this.$store.dispatch('ui/toggleDialog', {
        type: 'IMPORT_DIALOG',
        val: true
      })
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
