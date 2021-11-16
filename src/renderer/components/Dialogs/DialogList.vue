<template>
  <div>
    <DialogInitFolder v-if="isDialogActive('INIT_FOLDER_DIALOG')" />
    <DialogLogout v-if="isDialogActive('LOGOUT_DIALOG')" />
    <DialogAppAdd v-if="isDialogActive('APP_ADD_DIALOG')" />
    <DialogAppEdit v-if="isDialogActive('APP_EDIT_DIALOG')" />
    <DialogConfirmation v-if="isDialogActive('CONFIRMATION_DIALOG')" />
    <DialogAccountAdd v-if="isDialogActive('ACCOUNT_ADD_DIALOG')" />
    <DialogAccountEdit v-if="isDialogActive('ACCOUNT_EDIT_DIALOG')" />
    <DialogImport v-if="isDialogActive('IMPORT_DIALOG')" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('ui', ['isDialogActive'])
  }
}
</script>

<style>
</style>
