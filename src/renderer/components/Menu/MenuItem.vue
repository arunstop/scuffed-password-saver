<template>
  <v-list-item
    :class="getStyle().menu"
    :link="active"
    @click.stop="execMenuAction(menu.page)"
  >
    <v-list-item-icon>
      <v-icon :color="getStyle().iconColor">
        {{ getIcon() }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        class="font-weight-medium"
        :class="getStyle().textStyles"
      >
        {{ menu.label }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    menu: { type: Object, default: () => ({}) },
    active: Boolean,
  },
  methods: {
    execMenuAction(page) {
      if (page.toLowerCase() === "settings") {
        this.$router.push({ name: "settings" });
      } else if (page.toLowerCase() === "index") {
        this.$router.push({ name: "index" });
      } else if (page.toLowerCase() === "exit") {
        this.$store.dispatch("ui/toggleDialog", {
          type: "CONFIRMATION_DIALOG",
          val: true,
          data: {
            color: "primary",
            title: "Exit",
            desc: "Are u sure you want to exit from this application? ",
            actions: {
              y: () => {
                this.$globals.window.close();
              },
            },
          },
        });
      }
    },
    getStyle() {
      if (this.active) {
        // return "v-item--active v-list-item--active";
        return {
          menu: "v-item--active v-list-item--active primary dark",
          iconColor: "white",
          textStyles: "white--text",
        };
      }
      return "";
    },
    getIcon() {
      if (this.active) {
        return this.menu.icons.on;
      }
      return this.menu.icons.off;
    },
  },
};
</script>

<style>
</style>
