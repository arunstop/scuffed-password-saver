<template>
  <v-app v-resize="onResize">
    <v-main>
      <v-app-bar color="primary" dark dense fixed clipped-left app>
        <v-app-bar-nav-icon
          @click.stop="toggleMainDrawer()"
          v-if="$vuetify.breakpoint.mdAndDown"
        />
        <v-app-bar-title>{{ $store.state.appName }}</v-app-bar-title>
      </v-app-bar>
      <v-row class="d-flex fill-height" no-gutters app>
        <v-navigation-drawer v-model="drawer" v-bind="{ ...drawerAttrs }">
          <v-app-bar v-if="$vuetify.breakpoint.mdAndDown" color="primary" dark dense>
             <v-app-bar-title>{{ $store.state.appName }}</v-app-bar-title>
          </v-app-bar>
          <v-list>
            <v-list-item
              v-for="[icon, label] in getMenuList()"
              :key="`sps-menu-${label}`"
              link
            >
              <v-list-item-icon>
                <v-icon>
                  {{ icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                {{ label }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <div class="flex-grow-1 fill-height pa-4">
          <SystemInformation />
        </div>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { remote } from "electron";
// import SystemInformation from "@/components/SystemInformation.vue";

export default {
  components: {},
  data() {
    return {
      externalContent: "",
      drawerAttrs: {},
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
  mounted() {
    // this.onResize()
  },
  watch: {
    "$vuetify.breakpoint.mdAndDown"(val) {
      if (val === true) {
        this.$store.dispatch("ui/toggleDrawer", true);
        this.drawerAttrs = { fixed: true, temporary: true, };
      } else {
        this.$store.dispatch("ui/toggleDrawer", true);
        this.drawerAttrs = { permanent: true };
      }
    },
  },
};
</script>

<style>
.e-nuxt-container {
  min-height: calc(100vh - 50px);
  background: linear-gradient(to right, #ece9e6, #ffffff);
  font-family: Helvetica, sans-serif;
}

.e-nuxt-content {
  display: flex;
  justify-content: space-around;
  padding-top: 100px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.e-nuxt-logo {
  width: 400px;
}

.e-nuxt-system-info {
  padding: 20px;
  border-top: 1px solid #397c6d;
  border-bottom: 1px solid #397c6d;
}

.e-nuxt-links {
  padding: 100px 0;
  display: flex;
  justify-content: center;
}

.e-nuxt-button {
  color: #364758;
  padding: 5px 20px;
  border: 1px solid #397c6d;
  margin: 0 20px;
  border-radius: 15px;
  font-size: 1rem;
}

.e-nuxt-button:hover {
  cursor: pointer;
  color: white;
  background-color: #397c6d;
}
</style>
