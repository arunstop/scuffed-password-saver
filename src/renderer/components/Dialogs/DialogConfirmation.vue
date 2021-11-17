<template>
  <v-dialog v-model="confirmationDialog" max-width="420">
    <v-card outlined>
      <v-card-title :class="dialog.data.color + '--text'">
        {{ dialog.data.title }}
      </v-card-title>
      <v-card-text>
        {{ dialog.data.desc }}
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn
          ref="btnConfirmationN"
          outlined
          tabindex="-1"
          @click.stop="actionN()"
        >
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
export default {
  computed: {
    dialog() {
      return this.$store.getters["ui/isDialogActive"]("CONFIRMATION_DIALOG");
    },
    confirmationDialog: {
      get() {
        return !!this.dialog;
      },
      set(v) {
        this.$store.dispatch("ui/toggleDialog", {
          type: "CONFIRMATION_DIALOG",
          val: v,
        });
      },
    },
  },
  mounted() {
    // console.log(this.data);
    window.addEventListener("keyup", this.keyUp);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyUp);
  },
  methods: {
    actionN() {
      this.dialog.data.actions.n?.() || this.hideDialog();
    },
    actionY() {
      this.dialog.data.actions?.y() || this.hideDialog();
    },
    keyUp(event) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "Spacebar" ||
        event.key === "Space bar"
      ) {
        this.actionY();
      }
    },
    hideDialog() {
      this.confirmationDialog = false;
    },
  },
};
</script>

<style>
</style>
