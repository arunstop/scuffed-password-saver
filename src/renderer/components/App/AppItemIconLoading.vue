<template>
  <v-btn
    class="text-none font-weight-bold mx-1 my-1 pointer-events-none"
    :color="status"
    large
  >
    {{ app.name }}
    <div>
      <v-progress-circular
        v-if="loading"
        class="ms-2"
        size="24"
        indeterminate
      />
      <v-icon v-if="status === 'success'" size="24">mdi-check</v-icon>
      <v-icon v-if="status === 'error'" size="24">mdi-close-thick</v-icon>
    </div>
  </v-btn>
</template>

<script>
export default {
  props: {
    app: { type: Object, default: () => {} },
  },
  computed: {
    status() {
      return this.app.icon === "failed"
        ? "error"
        : this.app.icon
        ? "success"
        : "";
    },
    loading() {
      return !this.app.icon;
    },
  },
};
</script>

<style>
</style>