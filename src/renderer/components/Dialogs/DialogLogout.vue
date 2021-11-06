<template>
  <v-dialog v-model="logoutDialog" max-width="420">
    <v-card outlined>
      <v-card-title class="primary--text">Exit from app?</v-card-title>
      <v-card-text>
        To be honest you can just close the program, boomer.
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn ref="btnDialogLogoutN" outlined @click.stop="hideDialog()">
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
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("ui", ["isDialogActive"]),
    logoutDialog: {
      get() {
        return this.isDialogActive("LOGOUT_DIALOG");
      },
      set(v) {
        this.hideDialog()
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
      this.$store.dispatch("ui/toggleDialog", {
          type: "LOGOUT_DIALOG",
          val: false,
        });
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