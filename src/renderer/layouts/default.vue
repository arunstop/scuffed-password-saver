<template>
  <!-- App.vue -->
  <div class="d-flex flex-column">
    <UtilWindowTitleBar />
    <div>
      <v-app>
        <!-- Sizes your content based upon application components -->
        <v-main ref="mainContainer" class="main-container">
          <!-- Provides the application the proper gutter -->
          <v-container fluid class="pb-12">
            <v-slide-x-transition>
              <Nuxt />
            </v-slide-x-transition>
          </v-container>
          <!-- Scroll to top button -->
          <v-slide-y-reverse-transition>
            <v-btn
              v-if="scrolled"
              class="sps-btn-scroll-to-top white--text"
              color="orange ligthen-2"
              @click="scrollToTop"
            >
              <v-icon x-large>mdi-chevron-up</v-icon>
            </v-btn>
          </v-slide-y-reverse-transition>
        </v-main>

        <div>
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

        <v-app-bar
          color="primary"
          dark
          dense
          absolute
          app
          clipped-left
          elevation="0"
        >
          <v-app-bar-nav-icon
            v-if="$vuetify.breakpoint.mdAndDown"
            @click.stop="toggleMainDrawer()"
          />
          <v-app-bar-title class="text-capitalize">{{
            pageName
          }}</v-app-bar-title>
        </v-app-bar>
        </div>
        <!-- <v-footer app></v-footer> -->

        <DialogList />
        <SnackbarList />
      </v-app>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// import SystemInformation from "@/components/SystemInformation.vue";

export default {
  components: {},
  middleware: ["initVaultPath", "initAppList", "initAccountList"],
  data() {
    return {
      externalContent: "",
      drawerAttrs: {},
      drawerModel: 0,
      scrolled: false,
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
    pageName() {
      const routeName = this.$nuxt.$route.name;
      return routeName === "index" ? "Home" : routeName;
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
    const mainContainer = this.$refs.mainContainer.$el.childNodes[0];
    mainContainer.onscroll = () => {
      if (mainContainer.scrollTop >= 100) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    };
  },
  methods: {
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
    scrollToTop() {
      // scroll to top
      this.$refs.mainContainer.$el.childNodes[0].scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    showBtnScrollToTop() {},
  },
};
</script>

<style>
@import "~/assets/main.css";

.sps-btn-scroll-to-top {
  position: fixed;
  margin-right: 24px;
  margin-bottom: 12px;
  bottom: 0;
  right: 0;
}
</style>
