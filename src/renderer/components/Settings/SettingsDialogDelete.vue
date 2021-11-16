<template>
  <div>
    <v-list-item class="">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('settings', [
      'dialogToDelete'
    ]),
    dialogToDeleteModel: {
      get () {
        return this.dialogToDelete
      },
      set (v) {
        this.$store.dispatch('settings/toggleDialogToDelete', v)
      }
    }
  }
}
</script>

<style>
</style>
