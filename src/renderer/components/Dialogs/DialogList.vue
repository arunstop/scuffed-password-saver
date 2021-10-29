<template>
  <div>
    <DialogInitFolder v-if="$store.state.ui.initFolderDialog"/>
    <DialogLogout v-if="$store.state.ui.logoutDialog" />
    <DialogAppAdd v-if="$store.state.ui.appAddDialog" />
    <DialogAppEdit v-if="$store.state.ui.appEditDialog" />
    <DialogConfirmation v-if="$store.state.ui.confirmationDialog" :data="$store.state.ui.confirmationDialog"/>
    <DialogAccountAdd v-if="$store.state.ui.accountAddDialog" />
    <DialogAccountEdit v-if="$store.state.ui.accountEditDialog" />
    <DialogImport v-if="$store.state.ui.importDialog"/>
  </div>
</template>
  
<script>
export default {};
</script>

<style>
</style>