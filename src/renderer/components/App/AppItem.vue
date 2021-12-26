<template>
  <v-expansion-panel
  :readonly="!app.urls.length"
    :class="
      !app.urls.length &&
      'v-alert--border v-alert--text warning--text'
    "
    active-class="v-alert--border v-alert--outlined v-alert--text primary--text"
  >
    <v-expansion-panel-header>
      <div class="d-flex align-center">
        <div class="font-weight-medium">{{ app.name }}</div>
        <v-spacer />
        <v-btn class="me-1" icon small color="primary" @click.stop="click()">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          class="me-1"
          icon
          small
          color="error"
          @click.stop="deleteItem(app.name)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content v-if="app.urls.length">
      <div>
        <v-chip
          v-for="(url, index) in getUrlList()"
          :key="index + url.url"
          class="me-1 mb-1 text-decoration-underline"
          small
          @click.stop="openUrl(url.trimmedUrl)"
        >
          {{ url.trimmedUrl }}
        </v-chip>
        <v-chip
          v-if="!hover && app.urls.length > 1"
          class="mb-1"
          small
          outlined
        >
          {{ "+ " + (app.urls.length - 1) + " more" }}
        </v-chip>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: {
    app: { type: Object, default: () => {} },
    click: { type: Function, default: () => {} },
    rclick: { type: Function, default: () => {} },
  },
  data() {
    return {
      //   hovered: false,
    };
  },
  computed: {
    color() {
      return this.app.urls.toString() ? "primary" : "warning";
    },
    trimmedName() {
      return this.app.name.replaceAll("www.", "").replaceAll();
    },
  },
  methods: {
    getUrlList() {
      // get only domain name
      const trimUrl = (url) => {
        return url
          .replaceAll("https://", "")
          .replaceAll("http://", "")
          .replaceAll("www.", "")
          .split("/")[0];
      };
      // create array with trimmedUrl in it
      const urlList = (this.app.urls || []).map((e) => ({
        url: e,
        trimmedUrl: trimUrl(e),
      }));
      // // if hovered, only show the first item
      // if (!hover) {
      //   return urlList.slice(0, 1);
      // }
      return urlList;
    },
    openUrl(url) {
      this.$globals.window.openUrl("http://" + url);
    },
    deleteApp(name) {
      this.$store.dispatch("app/deleteApp", name);
    },
    deleteItem(name) {
      this.$store.dispatch("ui/toggleDialog", {
        type: "CONFIRMATION_DIALOG",
        val: true,
        data: {
          color: "error",
          title: "Delete application",
          desc: `Are you sure you want to delete application: ${name}?`,
          actions: {
            y: () => {
              this.deleteApp(name);
            },
          },
        },
      });
    },
  },
};
</script>

<style>
.app-card {
  width: 240px;
  height: 80px;
  transition: all 1s;
}

.app-card-expand:hover {
  /* left:0;
    right:0;
  width: 100% !important;
   position: absolute; */
  z-index: 201;
  transform: scale(1.06);
  transition: all 0.4s;
}

.urls-list {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}
</style>
