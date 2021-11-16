<template>
  <v-chip class="ms-auto font-weight-black" color="error" small outlined link @click="action()">
    CLOSE
    <v-icon right small>mdi-close-thick</v-icon>
  </v-chip>
</template>

<script>
export default {
  props: {
    action: { type: Function, default: () => {} }
  }
}
</script>

<style>
</style>
