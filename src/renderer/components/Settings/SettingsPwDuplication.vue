<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title
          class="font-weight-black normal-white-space text-h5"
        >
          <v-icon
            class="mb-1"
            :class="!pwDuplicationModel || 'primary--text'"
          >
            mdi-content-copy
          </v-icon>
          Password Duplication
        </v-list-item-title>
        <v-list-item-subtitle
          class="text-break normal-white-space subtitle-2"
        >
          Allow multiple accounts to use the same exact passwords.
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-switch v-model="pwDuplicationModel" class="ms-4" inset />
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('settings', [
      'pwDuplication',
      'pwDupLimit'
    ]),
    pwDuplicationModel: {
      get () {
        return this.pwDuplication
      },
      set (v) {
        this.$store.dispatch('settings/togglePwDuplication', v)
      }
    }
  }
}
</script>

<style>

</style>
