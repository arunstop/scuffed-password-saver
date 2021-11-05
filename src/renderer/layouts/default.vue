<template>
  <!-- App.vue -->
  <div class="d-flex flex-column">
    <UtilWindowTitleBar/>
    <div>
      <v-app>
      <v-navigation-drawer v-model="drawer" floating app clipped absolute>
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
            :active="$nuxt.$route.name === menu.page"
          />
          <!-- </v-list-item-group> -->
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="primary" dark dense absolute app clipped-left elevation="0">
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.mdAndDown"
          @click.stop="toggleMainDrawer()"
        />
        <v-app-bar-title>{{ $nuxt.$route.name }}</v-app-bar-title>
      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-main class="main-container">
        <!-- Provides the application the proper gutter -->
        <v-container fluid >
          <v-slide-x-transition>
            <Nuxt />
          </v-slide-x-transition>
        </v-container>
      </v-main>

      <!-- <v-footer app></v-footer> -->

      <DialogList />
      <SnackbarList />
    </v-app>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { remote } from "electron";
// import SystemInformation from "@/components/SystemInformation.vue";

export default {
  components: {},
  middleware: ["initVaultPath", "initAppList", "initAccountList"],
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

</style>
