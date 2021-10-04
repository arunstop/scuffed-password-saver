<template>
  <v-app v-resize="onResize">
    <v-main>
      <v-app-bar color="primary" dark dense fixed clipped-left app>
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.mdAndDown"
          @click.stop="toggleMainDrawer()"
        />
        <v-app-bar-title>{{ $store.state.appName }}</v-app-bar-title>
      </v-app-bar>
      <v-row class="d-flex fill-height" no-gutters app>
        <v-navigation-drawer
          v-model="drawer"
          v-bind="{ ...drawerAttrs }"
          floating
        >
          <v-app-bar
            v-if="$vuetify.breakpoint.mdAndDown"
            color="primary"
            dark
            dense
            flat
          >
            <v-app-bar-title>{{ $store.state.appName }}</v-app-bar-title>
          </v-app-bar>
          <v-list shaped class="deep-purple--text text--darken-3">
            <!-- <v-list-item-group v-model="drawerModel" mandatory color="primary"> -->
              <MenuItem
                v-for="menu in getMenuList()"
                :key="`sps-menu-${menu.page}`"
                :menu="menu"
                :active="$nuxt.$route.name===menu.page"
              />
            <!-- </v-list-item-group> -->
          </v-list>
        </v-navigation-drawer>
        <div class="flex-grow-1 fill-height pa-4">
          <Nuxt />
        </div>
      </v-row>
      <!-- UI LIST -->
      <DialogList />
      <SnackbarList />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { remote } from "electron";
// import SystemInformation from "@/components/SystemInformation.vue";

export default {
  components: {},
  middleware: ["initVaultPath"],
  data() {
    return {
      externalContent: "",
      drawerAttrs: {},
      drawerModel: 0,
    };
  },
  computed: {
    ...mapGetters("ui", ["getMenuList"]),
    ...mapState("ui", ["mainDrawer"]),
    drawer: {
      get() {
        if (this.$vuetify.breakpoint.mdAndDown) {
          return this.mainDrawer;
        } else {
          return true;
        }
      },
      set(val) {
        this.$store.dispatch("ui/toggleDrawer", val);
      },
    },
  },
  watch: {
    "$vuetify.breakpoint.mdAndDown"(val) {
      if (val === true) {
        this.$store.dispatch("ui/toggleDrawer", false);
        this.drawerAttrs = { fixed: true, temporary: true };
      } else {
        this.$store.dispatch("ui/toggleDrawer", true);
        this.drawerAttrs = { permanent: true };
      }
    },
  },
  mounted() {
    // this.onResize()
  },
  methods: {
    openURL(url) {
      remote.shell.openExternal(url);
    },
    toggleMainDrawer() {
      // alert(this.mainDrawer)
      // this.drawer1 = !this.drawer1
      this.$store.dispatch("ui/toggleDrawer", true);
    },
    onResize() {
      // if(this.$vuetify.breakpoint.mdAndDown){
      //   alert('MD AND DOWN')
      // }
    },
  },
};
</script>

<style>
body {
  margin: 0 !important;
}
</style>
