<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="primary--text mb-1"> mdi-import </v-icon>
          Import accounts
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Import accounts from backup.
        </v-list-item-subtitle>
      </v-list-item-content>
      <div class="ms-2" style="max-width: 180px">
        <v-btn
          class="ms-2"
          max-width="240"
          large
          color="primary"
          style="text-overflow: ellipsis !important"
          @click="showImportDialog()"
        >
          Import
        </v-btn>
      </div>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      fileFormatModel: '',
      formExportAccs: false
    }
  },
  computed: {
    ...mapState('settings', ['reminderFreq', 'vaultPath'])
  },
  methods: {
    showImportDialog () {
      this.$store.dispatch('ui/toggleDialog', {
        type: 'IMPORT_DIALOG',
        val: true
      })
    },
    exportAccs () {}
  }
}
</script>

<style>
</style>
