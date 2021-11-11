<template>
  <v-hover v-slot="{ hover }">
    <v-card class="ma-2 pa-0 col-4" max-width="300px" outlined @click="editItem(acc)">
      <v-alert class="mb-0 pa-0" border="left" colored-border :color="color">
        <v-list-item>
          <v-list-item-avatar>
            <UtilProfile :alpha="acc.appName" :color="color" />
          </v-list-item-avatar>
          <v-list-item-content class="d-flex">
            <v-list-item-title class="font-weight-bold">
              <v-chip outlined small label color="primary">
                {{ acc.appName }}
              </v-chip>
              <v-chip
                class="ms-1 font-weight-bold"
                :color="color"
                outlined
                small
              >
                <v-icon left small>mdi-shield-plus-outline</v-icon>
                {{ acc.durab.percentage + "%" }}
              </v-chip>
            </v-list-item-title>
            <v-list-item-title
              class="font-weight-bold"
              :class="color + '--text'"
            >
              {{ acc.accountId }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ acc.accountPw }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-scale-transition origin="center center">
              <v-btn v-if="hover" icon color="error" @click.stop="deleteItem(acc)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-scale-transition>
          </v-list-item-avatar>
        </v-list-item>
      </v-alert>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    acc: { type: Object, default: () => {} },
  },
  computed: {
    color() {
      return this.acc.durab.status;
    },
  },
   methods:{
     editItem(item) {
      // console.log(item);
      this.$store.dispatch("ui/toggleDialog", {
        type: "ACCOUNT_EDIT_DIALOG",
        val: true,
        id: item.id,
      });
      // this.endSelectMode();
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
    deleteAccount(item) {
      this.$store.dispatch("account/deleteAccount", item);
    //   this.endSelectMode();
    },
  }
};
</script>

<style>
</style>