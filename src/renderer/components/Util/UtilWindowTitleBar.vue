<template>
  <div class="v-application theme--dark">
    <v-row
      no-gutters
      class="primary darken-4 window-title-bar"
      style="-webkit-app-region: drag"
    >
      <span class="pl-2" style="height: auto">{{ $store.state.appName }} </span>
      <v-spacer />
      <v-btn
        small
        depressed
        class="px-0 window-btn"
        color="transparent"
        tabindex="-1"
        @click="minimize()"
      >
        <v-icon small color="white">mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn
        small
        depressed
        class="px-0 window-btn"
        color="transparent"
        tabindex="-1"
        @click="maximize()"
      >
        <v-icon small color="white">mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn
        small
        depressed
        class="px-0 window-btn"
        color="red"
        tabindex="-1"
        @click="close()"
      >
        <v-icon small color="white">mdi-close-thick</v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { remote } from "electron";
export default {
  data() {
    return {
      window: remote.getCurrentWindow(),
    };
  },
  methods: {
    minimize() {
      this.window.minimize();
    },
    maximize() {
      if (this.window.isMaximized()) {
        this.window.unmaximize();
      } else {
        this.window.maximize();
      }
    },
    close() {
      this.window.reload();
    },
  },
};
</script>

<style>
.window-title-bar {
  align-items: center;
  /* -webkit-user-select: none; */
  /* user-select: none; */
  -webkit-app-region: drag;
}

.window-btn {
  -webkit-app-region: no-drag;
  user-select: none;
  border-radius: 0px;
}
/* .titlebar {
  
} */
</style>