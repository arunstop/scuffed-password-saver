<template>
  <div class="snackbar-container mb-4" no-gutters style="z-index: 210 !important">
    <v-scale-transition
      group
      class="d-flex flex-column flex-column-reverse align-center px-2"
      origin="center center"
    >
      <SnackbarItem
        v-for="snackbar in getSnackbarList()"
        :key="snackbar.id"
        :snackbar="snackbar"
      />
    </v-scale-transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('ui', ['getSnackbarList'])
  }
}
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
</style>
