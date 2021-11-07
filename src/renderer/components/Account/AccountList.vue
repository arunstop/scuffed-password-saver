<template>
  <div>
    <AccountSearch />
    <v-data-table :headers="headers" :items="sortedAccountList" item-key="id">
      <template #item="{ item }">
        <tr
          class="cursor-pointer"
          :class="isSelected(item.id)"
          @dblclick="!dblClickToEdit || editItem(item)"
          @click="selectItem(item)"
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
            <v-icon color="primary" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon
              color="error"
              @click="!dialogToDelete || deleteItem(item)"
              @dblclick.stop="dialogToDelete || deleteAccount(item.id)"
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
    // console.log(this.selectedItemList);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.selectedItemList = [];
      } else if (event.ctrlKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        this.selectedItemList = this.sortedAccountList.map((e) => e.id);
      } else if (
        event.key.toLowerCase() === "delete" &&
        this.selectedItemList.length
      ) {
        if (this.selectedItemList.length === 1) {
          this.deleteItem(
            this.sortedAccountList.find(
              (e) => e.id === this.selectedItemList[0]
            )
          );
        } else {
          console.log(
            this.sortedAccountList.filter((e) =>
              this.selectedItemList.includes(e.id)
            )
          );
          this.deleteItemMulti(
            this.sortedAccountList.filter((e) =>
              this.selectedItemList.includes(e.id)
            )
          );
        }
      }
      // console.log(this.selectedItemList);
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", {});
  },
  methods: {
    isSelected(id) {
      return this.selectedItemList.find((e) => e === id)
        ? "v-data-table__selected"
        : "";
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
    deleteItemMulti(itemList) {
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
            },
          },
        },
      });
    },
    deleteAccount(item) {
      this.$store.dispatch("account/deleteAccount", item);
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
</style>