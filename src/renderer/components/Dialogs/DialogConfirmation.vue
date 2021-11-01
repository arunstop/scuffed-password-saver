<template>
  <v-dialog v-model="confirmationDialog" max-width="420">
    <v-card outlined>
      <v-card-title :class="data.color + '--text'">{{
        data.template.title
      }}</v-card-title>
      <v-card-text>
        {{ data.template.desc }}
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn ref="btnConfirmationN" outlined @click.stop="actionN()">
          Cancel
        </v-btn>
        <v-btn
          ref="btnConfirmationY"
          :color="data.color || 'primary'"
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
  props: {
    data: { type: Object, default: () => {} },
  },
  computed: {
    confirmationDialog: {
      get() {
        return this.data.val;
      },
      set(v) {
        // alert(v)
        this.hideDialog();
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
      this.data.actions.n?.() || this.hideDialog();
    },
    actionY() {
      this.data.actions?.y() || this.hideDialog();
    },
    hideDialog() {
      this.$store.dispatch("ui/toggleConfirmationDialog", false);
    },
  },
};
</script>

<style>
</style>