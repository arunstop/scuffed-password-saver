<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="sortedAccountList"
      item-key="id"
      hide-default-footer
      disable-pagination
    >
      <template #body="{ items: accList }">
        <transition-group tag="tbody" name="fade-transition">
          <tr
            v-for="acc in accList"
            :key="acc.id"
            class="cursor-pointer"
            :class="isSelected(acc.id) ? 'v-data-table__selected' : ''"
            @contextmenu.prevent="!selectionMode && selectItem(acc.id)"
            @dblclick="
              !selectionMode && (!dblClickToEdit || showEditDialog(acc))
            "
            @click="selectionMode && selectItem(acc.id)"
          >
            <td>
              <v-chip
                class="font-weight-bold"
                color="primary"
                :outlined="!isSelected(acc.id)"
                label
                small
              >
                {{ acc.appName }}
              </v-chip>
            </td>
            <td>
              <span class="font-weight-black">
                {{ acc.accountId }}
              </span>
            </td>
            <td>
              <v-chip
                class="font-weight-bold"
                :color="acc.durab.status"
                :outlined="!isSelected(acc.id)"
                small
              >
                <v-icon left small>mdi-shield-plus-outline</v-icon>
                {{ acc.durab.percentage + "%" }}
              </v-chip>
            </td>
            <td>
              <v-hover v-slot="{ hover }">
                <div
                  class="text-truncate sps-acc-pw"
                  style="max-width: 90px"
                  :style="!hover && 'letter-spacing:1.4px; font-weight:bolder;'"
                >
                  {{
                    hover && hoverToShowPw
                      ? acc.accountPw
                      : hiddenPw(acc.accountPw)
                  }}
                </div>
              </v-hover>
            </td>
            <td>
              <v-icon color="primary" @click.prevent="showEditDialog(acc)">
                mdi-pencil
              </v-icon>
              <v-icon
                color="error"
                @click.self="!dialogToDelete || showDeleteDialog(acc)"
                @dblclick.stop="dialogToDelete || deleteAccount(acc)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </transition-group>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  props: {
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      selectMode: false,

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
    ...mapGetters("ui/accountList", ["isSelected"]),
    ...mapState("ui/accountList", ["selectionMode", "selectedItemList"]),
    ...mapState("settings", [
      "hoverToShowPw",
      "dialogToDelete",
      "dblClickToEdit",
      "darkTheme",
    ]),
    sortedAccountList() {
      return this.data;
    },
  },
  methods: {
    ...mapActions("ui/accountList", [
      "selectItem",
      "clearSelection",
      "showEditDialog",
      "showDeleteDialog",
      "deleteAccount",
    ]),
    hiddenPw(pw) {
      let stars = "";
      for (let index = 0; index < pw.length; index++) {
        stars = stars + "•";
      }
      return stars;
    },
  },
};
</script>

<style>
</style>
