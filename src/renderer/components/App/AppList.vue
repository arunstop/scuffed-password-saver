<template>
  <div>
    <v-btn color="success" @click="showDialog()">
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
        <v-btn class="mb-4" @click="getIcons()">
          GET ICONS
          <v-icon class="ms-2">mdi-download</v-icon>
        </v-btn>
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
              v-for="app in appList"
              :key="app.name + '0'"
              :app="app"
              :click="() => openAppEditDialog(app.name)"
            />
          </v-expansion-panels>
        </v-row>
        <v-dialog v-model="isGettingIcons" width="520" scrollable>
          <v-card>
            <v-card-title>Getting icons please wait...</v-card-title>
            <v-card-text
              class="d-flex"
              style="height: 300px"
            >
              <!-- <v-btn
                v-for="app in loadingAppList"
                :key="app.name"
                class="text-none me-2 mb-2"
                v-bind="loadingAppStyle(app.icon)"
              >
                {{ app.name }}
              </v-btn> -->
              <div class="d-flex justify-center flex-wrap ma-auto">
                <AppItemIconLoading
                v-for="app in loadingAppList"
                :key="app.name"
                :app="app"
              />
              </div>
            </v-card-text>
            <v-card-actions class="d-flex pa-4 justify-center">
              <v-btn
                v-if="isDone"
                class=""
                outlined
                tabindex="-1"
                @click="toggleIsGettingIcons()"
              >
                Done
              </v-btn>
              <v-btn
                v-else
                class=""
                color="primary"
                @click="
                  () => {
                    hideDialog();
                  }
                "
              >
                Run in Background
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
    isDone: false,
  }),
  computed: {
    ...mapGetters("ui", ["isDialogActive"]),
    ...mapGetters("app", ["getUrllessApp"]),
    appList() {
      return _.sortBy(this.$store.state.app.appList, [(e)=>e.urls.length, "name"]);
    },
  },
  mounted() {
    this.$nuxt.$on("app-list-set-icon", (payload) => {
      // alert(payload.name)
      const target = this.loadingAppList.find((e) => e.name === payload.name);
      // end if target not found
      if(!target) return
      // console.log(target);
      target.icon = payload.url;
      // console.log(target)
      if (payload.url !== "failed") this.$store.dispatch("app/setIcon", target);

      // Check if all app is processed
      if (!this.loadingAppList.filter((e) => e.urls.length && !e.icon).length) {
        this.isDone=true
        this.$store.dispatch('ui/showSnackbar',
        {
          label: `Icons successfully loaded`,
          color: 'success'
        }
      )
      }
    });
  },
  methods: {
    showDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: this.dialogType,
        val: true,
      });
    },
    hideDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: this.dialogType,
        val: false,
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
      this.isDone=false
      // console.log(this.$store.state.app.appList);
      // Get list of app that has no icon but has links
      const iconlessAppList = this.appList.filter(
        (e) => e.urls.length && !e.icon
      );
      this.loadingAppList = _.cloneDeep(iconlessAppList);
      // setTimeout(() => {
      //   this.$nuxt.$emit("app-list-set-icon", { name: "Steam" });
      //   this.$nuxt.$emit("app-list-set-icon", { name: "Outlook" });
      //   this.$nuxt.$emit("app-list-set-icon", { name: "Protonmail" });
      // }, 1212);
      this.toggleIsGettingIcons();
      this.$API_appicon.getUrls(iconlessAppList);
    },
    toggleIsGettingIcons() {
      this.isGettingIcons = !this.isGettingIcons;
    },
  },
};
</script>

<style>
</style>
