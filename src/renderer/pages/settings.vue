<template>
  <v-list class="py-0">
    <!-- Hover to show password -->
    <SettingsHoverPw />
    <!-- Dialog to delete -->
    <SettingsDialogDelete />
    <!-- Double Click to view -->
    <SettingsDblClickEdit />
    <!-- Scroll down to load more data -->
    <SettingsScrollAutoLoad />
    <!-- Theme -->
    <SettingsTheme />
    <!-- Vault Location -->
    <SettingsVaultLocation />
    <!-- Password reminder -->
    <SettingsPwReminder />
    <!-- Password duplication -->
    <SettingsPwDuplication />
    <!-- Password duplication limit -->
    <SettingsPwDupLimit />
    <!-- Drive Auth -->
    <SettingsDriveAuth />
    <!-- Export -->
    <SettingsExport />
    <!-- Export -->
    <SettingsImport />
  </v-list>
</template>

<script>
export default {
}
</script>

<style>
.normal-white-space {
  white-space: normal;
}
</style>
