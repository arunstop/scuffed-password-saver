<template>
  <v-expand-transition>
    <div ref="selectionOpt" class="selection-opt">
      <v-card
        class="rounded-lg row no-gutters"
        no-gutters
        style="position:min-height:48px"
      >
        <!-- SORTING BUTTONS -->
        <div>
          <div class="my-3 ms-4">
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn
                  class="text-none me-2"
                  :color="!pinned ? 'primary' : 'white'"
                  v-bind="attrs"
                  outlined
                  small
                  v-on="on"
                >
                  <span class="me-2 font-weight-black"> SORT BY : </span>
                  <v-icon left>
                    {{ activeSortBy.icon }}
                  </v-icon>
                  <span class="text-decoration-underline">
                    {{
                      $vuetify.breakpoint.smAndDown
                        ? activeSortBy.labelSort
                        : activeSortBy.label
                    }}
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
              :color="!pinned ? 'primary' : 'white'"
              outlined
              small
              @click="setOrderValue(orderValue.val)"
            >
              <v-icon left>
                {{ orderValue.icon }}
              </v-icon>
              <span class="font-weight-black">
                {{
                  $vuetify.breakpoint.smAndDown
                    ? orderValue.labelSort
                    : orderValue.label
                }}
              </span>
            </v-btn>
          </div>
        </div>
        <!-- {{$store.state.ui.accountList.selectedItemList}} -->
        <!-- SELECTION BUTTONS -->
        <div class="ms-auto">
          <v-slide-x-transition>
            <div v-if="selectionMode" class="d-flex justify-end">
              <div class="px-4 py-3">
                <v-btn
                  class="font-weight-bold"
                  color="error"
                  small
                  :disabled="!selectedItemList.length"
                  @click="deleteAccountMulti()"
                >
                  {{
                    $vuetify.breakpoint.smAndDown
                      ? `DELETE ${selectedItemList.length}`
                      : `DELETE ${selectedItemList.length} item(s)`
                  }}
                  <v-icon right>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  class="font-weight-bold ms-2"
                  small
                  outlined
                  :color="pinned ? 'white' : ''"
                  @click="clearSelection()"
                >
                  CANCEL
                  <v-icon right>
                    mdi-close-thick
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-slide-x-transition>
        </div>
      </v-card>
    </div>
  </v-expand-transition>
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
      pinned: false,
    };
  },
  computed: {
    ...mapState("account", ["accountSearch"]),
    ...mapState("ui/accountList", [
      "selectionMode",
      "selectedItemList",
      "sortByValue",
      "sortByList",
      "orderValue",
      "paging",
    ]),
    ...mapGetters("app", [
      "getAppList",
      "getAppListByAccount",
      "getUnlistedApp",
    ]),
    ...mapGetters("ui/accountList", ["getActiveSortByValue"]),

    activeSortBy() {
      return this.getActiveSortByValue();
    },
    getTrimmedAppList() {
      return this.getAppListByAccount();
    },
    btnNeutColor() {
      return this.$vuetify.theme.dark ? "black" : "white";
    },
  },
  mounted() {
    // Detect keydown
    window.addEventListener("keydown", (event) => {
      // IF not in home page
      // AND there is dialog
      // THEN keydown does nothing
      if (
        this.$nuxt.$route.name !== "index" ||
        this.$store.state.ui.dialogList.length ||
        !this.data.length
      ) {
        return;
      }

      // esc
      if (event.key === "Escape") {
        this.clearSelection();
      }
      // ctrl+a
      else if (event.ctrlKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        this.selectItemMulti(this.data.map((e) => e.id));
      }
      // delete
      else if (
        event.key.toLowerCase() === "delete" &&
        this.selectedItemList.length
      ) {
        // console.log(this.data)
        this.deleteAccountMulti();
      }
      // console.log(this.selectedItemList);
    });
    // console.log(this.$vuetify)
    const selectionOpt = this.$refs.selectionOpt;
    const observer = new IntersectionObserver(
      ([e]) => {
        const pinned = e.intersectionRatio < 1;
        this.pinned = pinned;
        const selectionDiv = e.target.classList;

        const selectionBox = e.target.firstChild.classList;
        // if (this.$vuetify.theme.dark) {
        //   selectionBox.toggle("theme--dark", !pinned);
        //   selectionBox.toggle("theme--light", pinned);
        // } else {
        //   selectionBox.toggle("theme--dark", pinned);
        // }
        selectionBox.toggle("sps-selection-opt-pinned", pinned);
        selectionBox.toggle("elevation-0", !pinned);
        selectionBox.toggle("elevation-6", pinned);
      },
      { threshold: [1] }
    );
    // console.log(selectionOpt.firstChild.classList);
    observer.observe(selectionOpt);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", (e) => {});
  },
  methods: {
    ...mapActions("ui/accountList", [
      "clearSelection",
      "selectItem",
      "selectItemMulti",
      "deleteAccountMulti",
    ]),
    setSortByValue(sortByItem) {
      this.$store.dispatch(
        "ui/accountList/setSortByValue",
        require("lodash").assign(sortByItem, { order: this.orderValue.val })
      );
    },
    setOrderValue(val) {
      this.$store.dispatch("ui/accountList/setOrderValue", val);
    },
    completeListing() {
      this.getUnlistedApp().forEach((e) => {
        this.$store.dispatch("app/addApp", {
          name: e.name,
          urls: "",
        });
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
  z-index: 1;
  display: flex;
  justify-content: space-between;
}
.sps-selection-opt-pinned {
  margin-top: 24px !important;
  background-color: var(--v-primary-base) !important;
  transition: 0.4s;
}
/* .selection-opt-pinned{
  border-left: thin var(--v-primary-base) solid !important;
  border-bottom: thin var(--v-primary-base) solid !important;
} */
</style>
