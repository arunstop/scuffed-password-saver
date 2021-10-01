<template>
  <v-dialog v-model="logoutDialog" max-width="300">
    <v-card>
      <v-card-title>Exit from app?</v-card-title>
      <v-card-text>
        To be honest you can just close the program, boomer.
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn outlined @click.stop="hideDialog()"> Cancel </v-btn>
        <v-btn color="primary" @click.stop="exitApp()"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { remote } from 'electron';
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
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleLogoutDialog", false);
    },
    exitApp(){
    //   this.$store.dispatch("ui/toggleLogoutDialog", false);
    // remote.getCurrentWindow().close()
    remote.getCurrentWebContents().reload()
    }
  },
};
</script>

<style>
</style>