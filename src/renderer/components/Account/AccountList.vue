<template>
  <div>
    <AccountSearch />
    <v-expand-transition>
      <div
        v-show="selectMode"
        ref="selectionOpt"
        class="selection-opt pointer-events-none"
      >
        <div class="d-flex justify-end selection-opt">
          <v-card class="pa-4 rounded-0 rounded-b-xl pointer-events" elevation="0">
            <v-chip
              class="font-weight-bold"
              color="error"
              small
              :disabled="!selectedItemList.length"
              @click="deleteItemMulti()"
            >
              DELETE {{ selectedItemList.length }} item(s)
              <v-icon right small>mdi-delete</v-icon>
            </v-chip>
            <v-chip
              class="font-weight-bold ms-2"
              small
              @click="endSelectMode()"
            >
              CANCEL
              <v-icon right small>mdi-close-thick</v-icon>
            </v-chip>
          </v-card>
        </div>
      </div>
    </v-expand-transition>
    <v-data-table :headers="headers" :items="sortedAccountList" item-key="id">
      <template #item="{ item }">
        <tr
          class="cursor-pointer"
          :class="isSelected(item.id)"
          @contextmenu.prevent="initSelectMode(item)"
          @dblclick="!selectMode && (!dblClickToEdit || editItem(item))"
          @click="selectMode && selectItem(item)"
        >
          <td>
            <v-chip color="primary" label small>
              {{ item.appName }}
            </v-chip>
          </td>
          <td>
            <span class="font-weight-black">
              {{ item.accountId }}
            </span>
          </td>
          <td>
            <v-chip
              class="font-weight-bold"
              :color="item.durab.status"
              outlined
              small
            >
              <v-icon left small>mdi-shield-plus-outline</v-icon>
              {{ item.durab.percentage + "%" }}
            </v-chip>
          </td>
          <td>
            <v-hover v-slot="{ hover }">
              <div>
                <input
                  :value="item.accountPw"
                  readonly
                  :type="!hoverToShowPw || !hover ? 'password' : 'text'"
                  style="width: 100%; max-width: 60px"
                  :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
                />
              </div>
            </v-hover>
          </td>
          <td>
            <v-icon color="primary" @click.prevent="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon
              color="error"
              @click.self="!dialogToDelete || deleteItem(item)"
              @dblclick.stop="dialogToDelete || deleteAccount(item)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      selectMode: false,
      selectedItemList: [],
      headers: [
        { text: "App / Website", value: "appName" },
        { text: "ID / Email / Phone Number", value: "accountId" },
        { text: "Durability", value: "durab.percentage" },
        { text: "Password / PIN", value: "accountPw", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters("account", ["getAccountList"]),
    ...mapState("settings", [
      "hoverToShowPw",
      "dialogToDelete",
      "dblClickToEdit",
      "darkTheme",
    ]),
    sortedAccountList() {
      // const sal = this.$globals.sortById({
      //   arr: this.$globals.cloneState(this.getAccountList()),
      //   order: "desc",
      //   prop: "id",
      //   replacedWord: "ACC",
      // }).map(e=>{
      //   return {...e,durab:this.pwDurab(e.editedPw)}
      // })
      const sal1 = _.sortBy(this.getAccountList(), [
        (e) => e.id.replace("ACC", "") * 1,
      ])
        .map((e) => {
          return { ...e, durab: this.pwDurab(e.editedPw) };
        })
        .reverse();
      // console.log(sal)
      // console.log(sal1);
      return sal1;
    },
  },
  mounted() {
    // Detect keydown
    window.addEventListener("keydown", (event) => {
      // esc
      if (event.key === "Escape") {
        this.endSelectMode();
      }
      // ctrl+a
      else if (event.ctrlKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        this.initSelectMode();
        this.selectedItemList = this.sortedAccountList.map((e) => e.id);
      }
      // delete
      else if (
        event.key.toLowerCase() === "delete" &&
        this.selectedItemList.length
      ) {
        this.deleteItemMulti();
      }
      // console.log(this.selectedItemList);
    });
// console.log(this.$vuetify)
    const selectionOpt = this.$refs.selectionOpt;
    const observer = new IntersectionObserver(
      ([e]) => {
        const soChild=e.target.firstChild.firstChild.classList
        soChild.toggle("primary-t", e.intersectionRatio < 1)
      },
      { threshold: [1] }
    );
    // console.log(selectionOpt.firstChild.classList);
    observer.observe(selectionOpt)
  },
  beforeDestroy() {
    window.removeEventListener("keydown", ()=>{
      alert('removed')
    });
  },
  methods: {
    isSelected(id) {
      return this.selectedItemList.find((e) => e === id)
        ? "v-data-table__selected"
        : "";
    },
    initSelectMode(item) {
      if (this.selectMode) return;
      this.selectMode = true;
      if (item) this.selectItem(item);
    },
    endSelectMode() {
      this.selectMode = false;
      this.selectedItemList = [];
    },
    selectItem(item) {
      if (this.isSelected(item.id)) {
        this.selectedItemList = this.selectedItemList.filter(
          (e) => e !== item.id
        );
      } else {
        this.selectedItemList.push(item.id);
      }
    },
    editItem(item) {
      // console.log(item);
      this.$store.dispatch("ui/toggleDialog", {
        type: "ACCOUNT_EDIT_DIALOG",
        val: true,
        id: item.id,
      });
      this.endSelectMode()
    },
    deleteItem(item) {
      this.$store.dispatch("ui/toggleDialog", {
        type: "CONFIRMATION_DIALOG",
        val: true,
        data: {
          color: "error",
          title: "Delete account",
          desc:
            "Are u sure you want to delete this " +
            item.appName +
            " account with ID : " +
            item.accountId +
            " ?",
          actions: {
            y: () => {
              this.deleteAccount(item);
            },
          },
        },
      });
    },
    deleteItemMulti() {
      if (this.selectedItemList.length === 1) {
        this.deleteItem(
          this.sortedAccountList.find((e) => e.id === this.selectedItemList[0])
        );
      } else {
        const itemList = this.sortedAccountList.filter((e) =>
          this.selectedItemList.includes(e.id)
        );
        this.$store.dispatch("ui/toggleDialog", {
          type: "CONFIRMATION_DIALOG",
          val: true,
          data: {
            color: "error",
            title: "Delete account",
            desc:
              "Are u sure you want to delete these " +
              itemList.length +
              " accounts ?",
            actions: {
              y: () => {
                itemList.forEach((e) => {
                  this.deleteAccount(e);
                });
                this.endSelectMode();
              },
            },
          },
        });
      }
    },
    deleteAccount(item) {
      this.$store.dispatch("account/deleteAccount", item);
      this.endSelectMode()
    },
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
.primary-t{
  background-color: var(--v-primary-base) !important;
  transition: .6s;
}
/* .selection-opt-pinned{
  border-left: thin var(--v-primary-base) solid !important;
  border-bottom: thin var(--v-primary-base) solid !important;
} */
</style>