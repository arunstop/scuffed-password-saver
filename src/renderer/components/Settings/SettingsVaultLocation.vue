<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="primary--text mb-1"> mdi-safe-square </v-icon>
          Account Vault Location
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Currently saved at :
          <span class="font-weight-black text-decoration-underline">{{ vaultPath }}</span>
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
        Change
      </v-btn>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("settings", ["vaultPath"]),
    darkThemeModel: {
      get() {
        return this.darkTheme ? 1 : 0;
      },
      set(v) {
        this.$store.dispatch("settings/toggleDarkTheme", v === 1);
      },
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
</style>