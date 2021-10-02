<template>
  <div class="snackbar-container" no-gutters >
    <v-scale-transition group class="d-flex flex-column flex-column-reverse align-center" origin="center center">
    <SnackbarItem
      v-for="snackbar in getSnackbarList()"
      :key="snackbar.id"
      :snackbar="snackbar"
    />
    </v-scale-transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("ui", ["getSnackbarList"]),
  },
};
</script>

<style scoped>
.snackbar-container{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>