<template>
  <div>
    <v-btn color="success" @click="doShowAppListDialog()">
      <v-icon left>mdi-application-outline</v-icon>
      Application List
    </v-btn>
    <DialogBigTemplate
      v-if="isDialogActive(dialogType)"
      :type="dialogType"
      :title="'Websites and applications list'"
      no-action
    >
      <template #body>
        <v-alert
          v-if="getUrllessApp()"
          type="warning"
          border="left"
          text
          icon="mdi-alert-circle"
        >
          Some applications/websites have no urls of a website to get linked to.
          Add them by clicking the items below.
          <br />
        </v-alert>
        <v-btn @click="getIcons()"> GET ICONS </v-btn>
        <!-- <v-row no-gutters align="center" justify="space-around">
          <AppCard
            v-for="app in $store.state.app.appList"
            :key="app.name + '0'"
            :app="app"
            :click="() => openAppEditDialog(app.name)"
          />
        </v-row> -->
        <v-row justify="center" no-gutters>
          <v-expansion-panels accordion inset>
            <AppItem
              v-for="app in $store.state.app.appList"
              :key="app.name + '0'"
              :app="app"
              :click="() => openAppEditDialog(app.name)"
            />
          </v-expansion-panels>
        </v-row>
        <v-overlay v-if="isGettingIcons" absolute>
          <v-card>
            <v-card-text>
              <v-btn
                v-for="app in loadingAppList"
                :key="app.name"
                class="text-none me-2 mb-2"
                v-bind="loadingAppStyle(app.icon)"
              >
                {{ app.name }}
              </v-btn>
              <v-btn @click="toggleIsGettingIcons()">STOP</v-btn>
            </v-card-text>
          </v-card>
        </v-overlay>
      </template>
    </DialogBigTemplate>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
  data: () => ({
    dialogType: "APP_LIST_DIALOG",
    isGettingIcons: false,
    loadingAppList: [],
  }),
  computed: {
    ...mapGetters("ui", ["isDialogActive"]),
    ...mapGetters("app", ["getUrllessApp"]),
  },
  mounted() {
    this.$nuxt.$on("app-list-set-icon", (payload) => {
      // alert(payload.name)
      const target = this.loadingAppList.find((e) => e.name === payload.name);
      target.icon = payload.url;
      // console.log(target)
      this.$store.dispatch('app/setIcon', target)
      // Check if all app is processed
      if(!this.loadingAppList.filter((e) => e.urls.length && !e.icon).length){
        // this.loadingAppList=[]
      }
    });
  },
  methods: {
    act() {
      alert("act");
    },
    doShowAppListDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: this.dialogType,
        val: true,
      });
    },
    ...mapActions("ui", ["toggleDialog"]),
    // snack() {
    //   this.$store.dispatch("ui/showSnackbar", {
    //     label: "snack",
    //     color: "success",
    //   });
    // },
    openAppAddDialog() {
      this.toggleDialog({ type: "APP_ADD_DIALOG", val: true });
    },
    openAppEditDialog(name) {
      this.toggleDialog({ type: "APP_EDIT_DIALOG", val: true, name });
    },
    openAccountAddDialog() {
      this.toggleDialog({ type: "ACCOUNT_ADD_DIALOG", val: true });
    },
    deleteApp(name) {
      this.$store.dispatch("app/deleteApp", name);
    },
    getIcons() {
      // console.log(this.$store.state.app.appList);
      // Get list of app that has no icon but has links
      const iconlessAppList = this.$store.state.app.appList.filter(
        (e) => e.urls.length && !e.icon
      );
      this.loadingAppList = _.cloneDeep(iconlessAppList);
      // setTimeout(() => {
      //   this.$nuxt.$emit("app-list-set-icon", { name: "Steam" });
      //   this.$nuxt.$emit("app-list-set-icon", { name: "Outlook" });
      //   this.$nuxt.$emit("app-list-set-icon", { name: "Protonmail" });
      // }, 1212);
      this.$API_appicon.getUrls(iconlessAppList);
      this.toggleIsGettingIcons();
    },
    toggleIsGettingIcons() {
      this.isGettingIcons = !this.isGettingIcons;
    },
    loadingAppStyle(icon) {
      return {
        // if failed color = error
        // if sucess color = green
        // if waiting color = default (black)
        color: icon === "failed" ? "error" : icon ? "success" : "",
        loading: !icon,
      };
    },
  },
};
</script>

<style>
</style>
