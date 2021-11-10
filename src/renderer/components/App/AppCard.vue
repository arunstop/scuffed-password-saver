<template>
  <v-hover v-slot="{ hover }">
    <div class="ma-2 app-card">
      <v-card
        :class="hover && 'app-card-expand'"
        outlined
        @click="click()"
      >
        <v-alert class="mb-0 pa-0" border="left" colored-border :color="color">
          <v-list-item>
            <v-list-item-avatar>
              <UtilProfile :alpha="app.name" :color="color" />
            </v-list-item-avatar>
            <v-list-item-content class="d-flex">
              <v-list-item-title
                class="font-weight-bold"
                :class="color + '--text'"
              >
                {{ app.name }}
              </v-list-item-title>
              <div v-if="app.urls.length" class="mt-1">
                <v-chip
                  v-for="(url, index) in getUrlList(hover)"
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
            </v-list-item-content>
          </v-list-item>
        </v-alert>
      </v-card>
    </div>
  </v-hover>
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
    getUrlList(hover) {
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
      // if hovered, only show the first item
      if (!hover) {
        return urlList.slice(0, 1);
      }
      return urlList;
    },
    openUrl(url) {
      this.$globals.openUrl("http://" + url);
    },
  },
};
</script>

<style>
.app-card{
    min-width: 240px; height:80px;
    transition: all 1s;
}

.app-card-expand {
    left:0;
  width: 100% !important;
  position: absolute;
  z-index:201;
  transition: all 1s;
}

.urls-list {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}
</style>