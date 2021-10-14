<template>
  <v-list class="px-4">
    <!-- Hover to show password -->
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
            :class="!hoverToShowPwModel || 'primary--text'"
          >
            <v-icon
              class="mb-1"
              :class="!hoverToShowPwModel || 'primary--text'"
            >
              mdi-eye
            </v-icon>
            Hover to show password
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Hover mouse to password column in table of accounts to reveal the
            password.
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-switch v-model="hoverToShowPwModel" class="ms-4" inset />
      </v-list-item>
      <v-divider />
    </template>
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
            :class="!dialogToDeleteModel || 'primary--text'"
          >
            <v-icon
              class="mb-1"
              :class="!dialogToDeleteModel || 'primary--text'"
            >
              mdi-comment-question
            </v-icon>
            Use dialog to confirm account deletions
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Confirmation dialog is important to avoid 'missclicks'. If this is
            turned off, double click to delete account is applied.
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-switch v-model="dialogToDeleteModel" class="ms-4" inset />
      </v-list-item>
      <v-divider />
    </template>
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
            :class="!dblClickToEditModel || 'primary--text'"
          >
            <v-icon
              class="mb-1"
              :class="!dblClickToEditModel || 'primary--text'"
            >
              mdi-cursor-default-click
            </v-icon>
            Double click to edit/view account detail
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Double click on a row in account table to view detail and/or edit
            the account.
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-switch v-model="dblClickToEditModel" class="ms-4" inset />
      </v-list-item>
      <v-divider />
    </template>
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
            :class="!darkThemeModel || 'primary--text'"
          >
            <v-icon class="mb-1" :class="!darkThemeModel || 'primary--text'">
              mdi-brightness-6
            </v-icon>
            Theme
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Choose theme for the app, Light or Dark, whatever you like.
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-item-group
          v-model="darkThemeModel"
          class="ms-2"
          active-class="primary"
          mandatory
        >
          <v-item v-slot="{ active, toggle }" class="me-2">
            <v-btn large :outlined="!active" @click="toggle">
              <v-icon left> mdi-white-balance-sunny</v-icon> Light
            </v-btn>
          </v-item>
          <v-item v-slot="{ active, toggle }">
            <v-btn large :outlined="!active" @click="toggle">
              <v-icon left> mdi-weather-night</v-icon> Dark
            </v-btn>
          </v-item>
        </v-item-group>
      </v-list-item>
      <v-divider />
    </template>
  </v-list>
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
    ]),
    hoverToShowPwModel: {
      get() {
        return this.hoverToShowPw;
      },
      set(v) {
        this.$store.dispatch("settings/toggleHoverToShowPw", v);
      },
    },
    dialogToDeleteModel: {
      get() {
        return this.dialogToDelete;
      },
      set(v) {
        this.$store.dispatch("settings/toggleDialogToDelete", v);
      },
    },
    dblClickToEditModel: {
      get() {
        return this.dblClickToEdit;
      },
      set(v) {
        this.$store.dispatch("settings/toggleDblClickToEdit", v);
      },
    },
    darkThemeModel: {
      get() {
        return this.darkTheme ? 1 : 0;
      },
      set(v) {
        this.$store.dispatch("settings/toggleDarkTheme", v === 1);
      },
    },
  },
};
</script>

<style>
.normal-white-space {
  white-space: normal;
}
</style>