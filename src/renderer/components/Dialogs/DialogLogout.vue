<template>
  <v-dialog v-model="logoutDialog" max-width="420">
    <v-card outlined>
      <v-card-title class="primary--text">Exit from app?</v-card-title>
      <v-card-text>
        To be honest you can just close the program, boomer.
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn ref="btnDialogLogoutN" color="primary" outlined @click.stop="hideDialog()">
          Cancel
        </v-btn>
        <v-btn ref="btnDialogLogoutY" color="primary" @click.stop="exitApp()">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { remote } from "electron";
export default {
  computed: {
    logoutDialog: {
      get() {
        return this.$store.state.ui.logoutDialog;
      },
      set(v) {
        this.$store.dispatch("ui/toggleLogoutDialog", v);
      },
    },
  },
  mounted() {
    // window.addEventListener("keyup", (e) => {
    //   if (
    //     e.key === "Enter" ||
    //     e.key === " " ||
    //     e.key === "Spacebar" ||
    //     e.key === "Space bar"
    //   ) {
    //     this.$refs.btnDialogLogoutY.$el.click();
    //   }
    // });
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleLogoutDialog", false);
    },
    exitApp() {
      //   this.$store.dispatch("ui/toggleLogoutDialog", false);
      // remote.getCurrentWindow().close()
      remote.getCurrentWebContents().reload();
    },
  },
};
</script>

<style>
</style>