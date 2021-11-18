<template>
  <div style="position: relative; min-height: 100vh">
    <LazyAccountSearch :data="sortedAccountList" />
    <v-row class="d-flex justify-sm-space-between" no-gutters>
      <div class="my-2 ms-1">
        <v-menu>
          <template #activator="{ on, attrs }">
            <v-btn
              class="text-none me-2"
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              <span class="me-2 font-weight-black"> SORT BY : </span>
              <v-icon left>
                {{ activeSortBy.icon }}
              </v-icon>
              <span class="text-decoration-underline">
                {{ activeSortBy.label }}
              </span>
            </v-btn>
          </template>

          <v-list class="py-0">
            <v-list-item
              v-for="sb in sortByList"
              :key="sb.val"
              class="font-weight-medium"
              :class="
                activeSortBy.val === sb.val
                  ? `primary--text v-list-item--active v-list-item--highlighted`
                  : ''
              "
              active-class="primary"
              @click="setSortByValue(sb)"
            >
              <v-list-item-icon class="me-2">
                <v-icon>{{ sb.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ sb.label }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn color="primary" outlined @click="setOrderValue(orderValue.val)">
          <v-icon left>
            {{ orderValue.icon }}
          </v-icon>
          <span class="font-weight-black">
            {{ orderValue.label }}
          </span>
        </v-btn>
      </div>
      <div class="ms-auto">
        <LazyAccountListSelection :data="sortedAccountList" />
      </div>
    </v-row>
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
    <LazyAccountListLoader  v-if="!lastPage"/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
export default {
  computed: {
    ...mapGetters("account", ["getAccountList"]),
    ...mapGetters("ui/accountList", ["getActiveSortByValue"]),
    ...mapState("ui/accountList", [
      "sortByValue",
      "sortByList",
      "orderValue",
      "paging",
    ]),
    ...mapState("settings", ["scrollAutoLoad"]),
    activeSortBy() {
      return this.getActiveSortByValue();
    },
    sortedAccountList() {
      const sal = this.getAccountList().map((e) => {
        // adding pw durability
        return { ...e, durab: this.pwDurab(e.editedPw) };
      });
      const sorted = _.sortBy(sal, [this.sortByValue.val]);
      // console.log(sorted.map(e=>({accId:e.accountId,date:e.edited})))
      const dataSum = this.paging.page * this.paging.count
      const paged = (
        this.orderValue.val === "desc" ? sorted.reverse() : sorted
      ).slice(0, dataSum);
      return paged;
    },
    lastPage() {
      return this.paging.page * this.paging.count >= this.getAccountList().length;
    },
  },
  methods: {
    pwDurab(edited) {
      return this.$globals.getPwDurability(
        edited,
        this.$store.state.settings.reminderFreq
      );
    },
    setSortByValue(sortByItem) {
      this.$store.dispatch(
        "ui/accountList/setSortByValue",
        require("lodash").assign(sortByItem, { order: this.orderValue.val })
      );
    },
    setOrderValue(val) {
      this.$store.dispatch("ui/accountList/setOrderValue", val);
    },
    ...mapActions("ui", ["toggleDialog"]),
    resetSearch() {
      this.$store.dispatch("account/setAccountSearch", "");
    },
    openAccountAddDialog() {
      this.toggleDialog({ type: "ACCOUNT_ADD_DIALOG", val: true });
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
