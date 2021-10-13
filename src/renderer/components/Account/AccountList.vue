<template>
  <v-data-table :headers="headers" :items="sortedAccountList">
    <template #[`item.appName`]="{ item }">
      <v-chip color="primary">
        {{ item.appName }}
      </v-chip>
      <!-- <v-chip color="primary">
        {{ index }}
      </v-chip> -->
    </template>
    <template #[`item.accountId`]="{ item }">
      <span class="font-weight-black">
        {{ item.accountId }}
      </span>
      <!-- <v-chip color="primary">
        {{ index }}
      </v-chip> -->
    </template>
    <template #[`item.accountPw`]="{ item }">
      <v-hover v-slot="{ hover }">
        <input
          :value="item.accountPw"
          readonly
          :type="hover ? 'text' : 'password'"
          style="color: black !important; width: 100%; max-width:60px;"
        />
      </v-hover>
      <!-- <v-chip color="primary">
        {{ index }}
      </v-chip> -->
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon color="primary" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon color="error" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      headers: [
        { text: "App / Website", value: "appName" },
        { text: "ID / Email / Phone Number", value: "accountId" },
        { text: "Password / PIN", value: "accountPw", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters("account", ["getAccountList"]),
    sortedAccountList() {
      return this.$globals.sortById({
        arr: this.$globals.cloneState(this.getAccountList()),
        order: "desc",
        prop: "id",
        replacedWord: "ACC",
      });
    },
  },
  created() {
    console.log(this.sortedAccountList);
  },
  methods: {
    editItem(item) {
      this.$store.dispatch("ui/toggleAccountEditDialog", {
        val: true,
        id: item.id,
      });
    },
    deleteItem(item) {
      this.$store.dispatch("ui/toggleConfirmationDialog", {
        val: true,
        color: "error",
        template: {
          title: "Delete account",
          desc:
            "Are u sure you want to delete this " +
            item.appName +
            " account (ID : " +
            item.accountId +
            ") ?",
        },
        actions: {
          y: () => {
            this.$store.dispatch("account/deleteAccount", item.id);
          },
        },
      });
    },
  },
};
</script>

<style>
</style>