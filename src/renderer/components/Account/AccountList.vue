<template>
  <div>
    <AccountSearch />
    <v-fade-transition leave-absolute group>
      <AccountListTable v-if="$store.state.ui.accViewVal === 'table'" :key="'al-table'" :data="sortedAccountList"/>
    <AccountListCard v-else-if="$store.state.ui.accViewVal === 'card'" :key="'al-card'" :data="sortedAccountList"/>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import _ from "lodash";
export default {
  computed: {
    ...mapGetters("account", ["getAccountList"]),

    sortedAccountList() {
      return _.sortBy(this.getAccountList(), [
        // sory by edited
        (e) => e.edited,
      ])
        .map((e) => {
          // adding pw durability
          return { ...e, durab: this.pwDurab(e.editedPw) };
        })
        .reverse();
    },
  },
  methods: {
    pwDurab(edited) {
      return this.$globals.getPwDurability(
        edited,
        this.$store.state.settings.reminderFreq
      );
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