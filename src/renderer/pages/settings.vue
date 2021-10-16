<template>
  <v-list class="px-4">
    <!-- Hover to show password -->
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
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
          >
            <v-icon class="primary--text mb-1"> mdi-brightness-6 </v-icon>
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
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
          >
            <v-icon class="primary--text mb-1"> mdi-safe-square </v-icon>
            Account Vault Location
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Currently saved at :
            <span class="font-weight-black">{{ vaultPath }}</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn
          class="ms-2"
          max-width="240"
          large
          color="primary"
          style="text-overflow: ellipsis !important"
          @click="openVaultPath()"
        >
          change
        </v-btn>
      </v-list-item>
      <v-divider />
    </template>
    <template v-if="true">
      <v-list-item class="ps-0">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
          >
            <v-icon class="primary--text mb-1"> mdi-lock-clock </v-icon>
            Password change reminder
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Set how frequent app will be at reminding you to change your
            password.
          </v-list-item-subtitle>
        </v-list-item-content>
        <div class="ms-2" style="max-width: 180px">
          <v-select
            v-model="reminderFreqModel"
            :items="reminderFreqItems"
            outlined
            hide-details
          >
          </v-select>
        </div>
      </v-list-item>
      <v-divider />
    </template>
  </v-list>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("settings", [
      "hoverToShowPw",
      "dialogToDelete",
      "dblClickToEdit",
      "darkTheme",
      "vaultPath",
      "reminderFreq",
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
    reminderFreqModel: {
      get() {
        const v = this.reminderFreq;
        return v + (v === 1 ? " month" : " months");
      },
      set(v) {
        this.$store.dispatch("settings/setReminderFreq", v);
      },
    },
    reminderFreqItems() {
      const rf = [];
      for (let i = 1; i <= 12; i++) {
        rf.push(i + (i === 1 ? " month" : " months"));
      }
      return rf;
    },
  },
  methods: {
    openVaultPath() {
      this.$store.dispatch("ui/toggleInitFolderDialog", true);
    },
  },
};
</script>

<style>
.normal-white-space {
  white-space: normal;
}
</style>