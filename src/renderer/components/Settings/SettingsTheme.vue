<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title
          class="font-weight-black normal-white-space text-h5"
        >
          <v-icon class="primary--text mb-1"> mdi-brightness-6 </v-icon>
          Theme
        </v-list-item-title>
        <v-list-item-subtitle
          class="text-break normal-white-space subtitle-2"
        >
          Choose theme for the app, Light or Dark, whatever you like.
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-item-group
        v-model="darkThemeModel"
        class="ms-2"
        active-class="primary"
        mandatory
      >
        <v-item v-slot="{ active, toggle }" class="me-2">
          <v-btn large :outlined="!active" @click="toggle">
            <v-icon left> mdi-white-balance-sunny</v-icon> Light
          </v-btn>
        </v-item>
        <v-item v-slot="{ active, toggle }">
          <v-btn large :outlined="!active" @click="toggle">
            <v-icon left> mdi-weather-night</v-icon> Dark
          </v-btn>
        </v-item>
      </v-item-group>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('settings', [
      'hoverToShowPw',
      'dialogToDelete',
      'dblClickToEdit',
      'darkTheme',
      'vaultPath',
      'reminderFreq',
      'pwDuplication',
      'pwDupLimit'
    ]),
    darkThemeModel: {
      get () {
        return this.darkTheme ? 1 : 0
      },
      set (v) {
        this.$store.dispatch('settings/toggleDarkTheme', v === 1)
      }
    }
  }
}
</script>

<style>

</style>
