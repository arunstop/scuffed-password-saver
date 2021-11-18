<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title
          class="font-weight-black normal-white-space text-h5"
        >
          <v-icon
            class="mb-1"
            :class="!scrollAutoLoadModel || 'primary--text'"
          >
            mdi-transfer-down
          </v-icon>
          Autoload data on scroll down
        </v-list-item-title>
        <v-list-item-subtitle
          class="text-break normal-white-space subtitle-2"
        >
          Scroll down to load more account data. If this is turned off, there will be a button to load more data.
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-switch v-model="scrollAutoLoadModel" class="ms-4" inset />
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('settings', [
      'scrollAutoLoad'
    ]),
    scrollAutoLoadModel: {
      get () {
        return this.scrollAutoLoad
      },
      set (v) {
        this.$store.dispatch('settings/toggleScrollAutoLoad', v)
      }
    }
  }
}
</script>

<style>

</style>
