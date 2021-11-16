<template>
  <div>
    <v-list-item class="">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('settings', [
      'dblClickToEdit'
    ]),
    dblClickToEditModel: {
      get () {
        return this.dblClickToEdit
      },
      set (v) {
        this.$store.dispatch('settings/toggleDblClickToEdit', v)
      }
    }
  }
}
</script>

<style>

</style>
