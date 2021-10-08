<template>
  <div v-resize="onResize" class="v-application theme--dark">
    <v-row
      no-gutters
      class="primary darken-4 window-title-bar"
      style="-webkit-app-region: drag"
    >
      <span class="pl-2" style="height: auto">{{ $store.state.appName }} </span>
      <v-spacer />
      <v-btn
        v-for="(btn, index) in windowButtonList"
        :key="'window-button-' + index"
        small
        depressed
        class="px-0 window-btn"
        :color="btn[minmax].action === 'close' ? 'red' : 'transparent'"
        tabindex="-1"
        @click="windowButtonAction(btn[minmax].action)"
      >
        <v-icon small color="white">{{ btn[minmax].icon }}</v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { remote } from "electron";
export default {
  data() {
    return {
      minmax: "",
      windowButtonList: [
        {
          min: { icon: "mdi-window-minimize", action: "minimize" },
          max: { icon: "mdi-window-minimize", action: "minimize" },
        },
        {
          min: { icon: "mdi-window-maximize", action: "maximize" },
          max: { icon: "mdi-window-restore", action: "unmaximize" },
        },
        {
          min: { icon: "mdi-close-thick", action: "close" },
          max: { icon: "mdi-close-thick", action: "close" },
        },
      ],
    };
  },
  created(){
    // initialize minmax
    this.onResize();
  },
  mounted() {
    // this.onResize();
  },
  methods: {
    onResize() {
      if (remote.getCurrentWindow().isMaximized()) {
        this.minmax = "max";
        // alert("max");
      } else {
        this.minmax = "min";
        // alert("min");
      }
    },
    windowButtonAction(action) {
      console.log(action);
      const window = remote.getCurrentWindow();
      if (action === "minimize") {
        window.minimize();
      } else if (action === "maximize") {
        window.maximize();
      } else if (action === "unmaximize") {
        window.unmaximize();
      } else if (action === "close") {
        window.reload();
      }
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