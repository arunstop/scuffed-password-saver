<template>
  <v-expand-transition>
        <div
          v-show="selectionMode"
          ref="selectionOpt"
          class="selection-opt pointer-events-none"
        >
          <div class="d-flex justify-end selection-opt">
            <v-card
              class="pa-4 rounded-0 rounded-b-xl pointer-events"
              elevation="0"
            >
              <v-chip
                class="font-weight-bold"
                color="error"
                small
                :disabled="!selectedItemList.length"
                @click="deleteItemMulti(data)"
              >
                DELETE {{ selectedItemList.length }} item(s)
                <v-icon right small>mdi-delete</v-icon>
              </v-chip>
              <v-chip
                class="font-weight-bold ms-2"
                small
                @click="clearSelection()"
              >
                CANCEL
                <v-icon right small>mdi-close-thick</v-icon>
              </v-chip>
            </v-card>
          </div>
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
    };
  },
  computed: {
    ...mapState("account", ["accountSearch"]),
    ...mapState("ui/accountList", ["selectionMode", "selectedItemList"]),
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
    // Detect keydown
    window.addEventListener("keydown", (event) => {
      // IF not in home page
      // AND there is dialog
      // THEN keydown does nothing
      if (
        this.$nuxt.$route.name !== "index" ||
        this.$store.state.ui.dialogList.length||
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
        this.deleteItemMulti(this.data);
      }
      // console.log(this.selectedItemList);
    });
    // console.log(this.$vuetify)
    const selectionOpt = this.$refs.selectionOpt;
    const observer = new IntersectionObserver(
      ([e]) => {
        const soChild = e.target.firstChild.firstChild.classList;
        soChild.toggle("primary-t", e.intersectionRatio < 1);
        soChild.toggle("elevation-0", e.intersectionRatio >= 1);
        soChild.toggle("elevation-6", e.intersectionRatio < 1);
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
      "deleteItemMulti",
    ]),
    search(v) {
      this.$store.dispatch("account/setAccountSearch", v || "");
      this.isLoading = false;
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