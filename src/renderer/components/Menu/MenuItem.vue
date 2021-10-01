<template>
  <v-list-item link @click.stop="execMenuAction(menu.label)">
    <v-list-item-icon>
      <v-icon>
        {{ menu.icon }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title class="font-weight-medium">
        {{ menu.label }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    menu: { type: Object, default: () => ({}) },
  },
  methods: {
    execMenuAction(label) {
      if (label.toLowerCase() === "logout") {
        this.$store.dispatch("ui/toggleLogoutDialog", true);
      }
    },
  },
};
</script>

<style>
</style>