<template>
  <div>
    <v-btn color="success" @click="doShowAppListDialog()">
      <v-icon left>mdi-application-outline</v-icon>
      Application List
    </v-btn>
    <DialogBigTemplate
      v-if="isDialogActive(dialogType)"
      :type="dialogType"
      :title="'Websites and applications list'"
      no-action
    >
      <template #body>
        <v-alert
          v-if="getUrllessApp()"
          type="warning"
          border="left"
          text
          icon="mdi-alert-circle"
        >
          Some applications/websites have no urls of a website to get linked to.
          Add them by clicking the items below.
          <br />
        </v-alert>
        <v-row no-gutters align="center" justify="space-around">
          <AppCard
            v-for="app in $store.state.app.appList"
            :key="app.name + '0'"
            :app="app"
            :click="() => openAppEditDialog(app.name)"
            :rclick="() => deleteApp(app.name)"
          />
        </v-row>
      </template>
    </DialogBigTemplate>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  data: () => ({
    dialogType: "APP_LIST_DIALOG",
  }),
  computed: {
    ...mapGetters("ui", ["isDialogActive"]),
    ...mapGetters("app", ["getUrllessApp"]),
  },
  methods: {
    act() {
      alert("act");
    },
    doShowAppListDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: this.dialogType,
        val: true,
      });
    },
    ...mapActions("ui", ["toggleDialog"]),
    // snack() {
    //   this.$store.dispatch("ui/showSnackbar", {
    //     label: "snack",
    //     color: "success",
    //   });
    // },
    openAppAddDialog() {
      this.toggleDialog({ type: "APP_ADD_DIALOG", val: true });
    },
    openAppEditDialog(name) {
      this.toggleDialog({ type: "APP_EDIT_DIALOG", val: true, name });
    },
    openAccountAddDialog() {
      this.toggleDialog({ type: "ACCOUNT_ADD_DIALOG", val: true });
    },
    deleteApp(name) {
      this.$store.dispatch("app/deleteApp", name);
    },
  },
};
</script>

<style>
</style>