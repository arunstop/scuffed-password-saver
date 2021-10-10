<template>
  <v-data-table :headers="headers" :items="getAccountList()">
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
    <template #[`item.actions`]="{ item }">
      <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
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
  },
  methods: {
    editItem(item) {
      this.$store.dispatch("ui/toggleAccountEditDialog", {
        val: true,
        account: item,
      });
    },
    deleteItem(item) {
      alert("delete" + item.accountId);
    },
  },
};
</script>

<style>
</style>