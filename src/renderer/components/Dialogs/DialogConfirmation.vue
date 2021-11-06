<template>
  <v-dialog v-model="confirmationDialog" max-width="420">
    <v-card outlined>
      <v-card-title :class="dialog.data.color + '--text'">{{
        dialog.data.title
      }}</v-card-title>
      <v-card-text>
        {{ dialog.data.desc }}
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn ref="btnConfirmationN" outlined @click.stop="actionN()">
          Cancel
        </v-btn>
        <v-btn
          ref="btnConfirmationY"
          :color="dialog.data.color || 'primary'"
          @click.stop="actionY()"
        >
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
    dialog(){
      return this.$store.getters['ui/isDialogActive']('CONFIRMATION_DIALOG')
    },
    confirmationDialog: {
      get() {
        return !!this.dialog;
      },
      set(v) {
        this.hideDialog()
      },
    },
  },
  mounted() {
    // console.log(this.data);
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
    actionN() {
      this.dialog.data.actions.n?.() || this.hideDialog();
    },
    actionY() {
      this.dialog.data.actions?.y() || this.hideDialog();
    },
    hideDialog() {
      this.$store.dispatch("ui/toggleDialog", {type:"CONFIRMATION_DIALOG",val:false});
    },
  },
};
</script>

<style>
</style>