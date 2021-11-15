<template>
  <div>
    <LazyAccountSearch :data="sortedAccountList" />
    <v-row class="d-flex justify-sm-space-between" no-gutters>
      <div class="ma-4 ms-1">
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
        <v-btn
          color="primary"
          outlined
          @click="setOrderValue(orderValue.val)"
        >
          <v-icon left>
            {{ orderValue.icon }}
          </v-icon>
          <span class="font-weight-black">
            {{ orderValue.label }}
          </span>
        </v-btn>
      </div>
      <!-- <v-select
        v-model="sortByValue"
        :items="sortByList"
        item-value="val"
        item-text="label"
        outlined
        hide-details
      >
        <template #item="{ item }">
          <v-icon left>
            {{ item.icon }}
          </v-icon>
          <span class="font-weight-bold">
            {{ item.label }}
          </span>
        </template>
      </v-select> -->
      <div class="ms-auto">
        <LazyAccountListSelection :data="sortedAccountList" />
      </div>
    </v-row>
    <v-fade-transition leave-absolute group>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import _ from "lodash";
export default {
  computed: {
    ...mapGetters("account", ["getAccountList"]),
    ...mapGetters("ui/accountList", ["getActiveSortByValue"]),
    ...mapState("ui/accountList", ["sortByValue", "sortByList", "orderValue"]),

    activeSortBy() {
      return this.getActiveSortByValue();
    },
    sortedAccountList() {
      const sal = this.getAccountList().map((e) => {
        // adding pw durability
        return { ...e, durab: this.pwDurab(e.editedPw) };
      });
      const salSorted = _.sortBy(sal, [this.sortByValue.val]);
      return this.orderValue.val === "desc" ? salSorted.reverse() : salSorted;
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