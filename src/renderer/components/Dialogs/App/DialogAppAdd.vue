<template>
  <v-dialog v-model="appAddDialog" max-width="480">
    <v-form ref="formAddApp" v-model="formAddApp" @submit="addApp()">
      <v-card outlined>
        <v-card-title>Add New Application</v-card-title>
        <v-card-text class="mt-4">
          <v-text-field
            v-model="appName"
            :rules="appNameRules"
            placeholder="Enter app or website name"
            label="Name"
            outlined
            prepend-icon="mdi-alphabetical-variant"
          />
          <v-textarea
            v-model="appUrls"
            placeholder="Enter app or website url, press Enter to add another one"
            label="URL (optional)"
            outlined
            prepend-icon="mdi-web"
          />
          <v-card-actions class="d-flex px-0">
            <v-btn
              ref="btnDialogAddAppN"
              class="flex-grow-1"
              large
              outlined
              tabindex="-1"
              @click.stop="hideDialog()"
            >
              Cancel
            </v-btn>
            <v-btn
              ref="btnDialogAddAppY"
              class="flex-grow-1"
              large
              color="success"
              @click.stop="addApp()"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    appName: "",
    appUrls: "",
    formAddApp: false,
  }),
  computed: {
    ...mapGetters("app", ["getAppByName"]),
    appAddDialog: {
      get() {
        return this.$store.state.ui.appAddDialog;
      },
      set(v) {
        this.$store.dispatch("ui/toggleAppAddDialog", v);
      },
    },
    appNameRules() {
      return [
        // IF appName is falsey (null,0,undefined) then it's error
        (v) => !!(v || "").trim() || "Application name is required!",
        // IF getAppByName() has value, then it's error
        (v) =>
          !this.getAppByName((v || "").trim()) || "Application already exists!",
      ];
    },
  },
  mounted() {
    // window.addEventListener("keyup", (e) => {
    //   if (
    //     e.key === "Enter" ||
    //     e.key === " " ||
    //     e.key === "Spacebar" ||
    //     e.key === "Space bar"
    //   ) {
    //     this.$refs.btnDialogAddAppY.$el.click();
    //   }
    // });
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleAppAddDialog", false);
    },
    addApp() {
      this.$refs.formAddApp.validate();
      if (this.formAddApp) {
        this.$store.dispatch("app/addApp", {
          name: this.appName,
          urls: this.$globals.lodash.compact(this.appUrls.trim().split("\n")),
        });
        // this.$store.dispatch("ui/showSnackbar", {
        //   label: this.appName + "has been added",
        //   color: "success",
        // });
        this.$refs.formAddApp.reset();
      }
    },
  },
};
</script>

<style>
</style>