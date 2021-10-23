<template>
  <div>
     <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="mb-1" :class="!hoverToShowPwModel || 'primary--text'">
            mdi-eye
          </v-icon>
          Hover to show password
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Hover mouse on password column in table of accounts to reveal the
          password.
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-switch v-model="hoverToShowPwModel" class="ms-4" inset />
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("settings", [
      "hoverToShowPw",
      "dialogToDelete",
      "dblClickToEdit",
      "darkTheme",
      "vaultPath",
      "reminderFreq",
      "pwDuplication",
      "pwDupLimit",
    ]),
    hoverToShowPwModel: {
      get() {
        return this.hoverToShowPw;
      },
      set(v) {
        this.$store.dispatch("settings/toggleHoverToShowPw", v);
      },
    },
  },
};
</script>

<style>
</style>