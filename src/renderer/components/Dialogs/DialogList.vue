<template>
  <div>
    <DialogInitFolder />
    <DialogLogout v-if="$store.state.ui.logoutDialog" />
    <DialogAppAdd v-if="$store.state.ui.appAddDialog" />
    <DialogAppEdit v-if="$store.state.ui.appEditDialog" />
  </div>
</template>
  
<script>
export default {};
</script>

<style>
</style>