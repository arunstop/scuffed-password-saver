<template>
  <v-dialog v-model="appEditDialog" max-width="480" attach=".main-container">
    <v-form ref="formAppEdit" v-model="formAppEdit" @submit.prevent="editApp()">
      <v-card outlined>
        <v-card-title>
          {{ "Edit Application " + appEditValue.name }}
        </v-card-title>
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
              ref="btnDialogEditAppN"
              class="flex-grow-1"
              large
              outlined
              tabindex="-1"
              @click.stop="hideDialog()"
            >
              Cancel
            </v-btn>
            <v-btn
              ref="btnDialogEditAppY"
              class="flex-grow-1"
              large
              color="success"
              :disabled="!formAppEdit"
              @click.stop="editApp()"
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
import { mapGetters, mapState } from "vuex";
export default {
  data: () => ({
    appName: "123",
    appUrls: "",
    formAppEdit: false,
  }),
  computed: {
    ...mapGetters("app", ["getAppByName"]),
    ...mapState("app", ["appEditValue"]),
    appEditDialog: {
      get() {
        return this.$store.getters['ui/isDialogActive']('APP_EDIT_DIALOG');
      },
      set(v) {
        this.hideDialog()
      },
    },
    appNameRules() {
      return [
        // IF appName is falsey (null,0,undefined) then it's error
        (v) => !!(v || "").trim() || "Application name is required!",
        // IF getAppByName() has value, then it's error
        // (v) => {
        //   v = (v || "").trim().toLowerCase();
        //   let error = false;
        //   if (this.getAppByName((v || "").trim())) {
        //     error = true;
        //   }
        //   if (error) return "Application already exists";
        // },
        (v) =>
          !this.getAppByName((v || "").trim()) || // check if name already exist
          (v || "").trim().toLowerCase() ===
            this.appEditValue.name.trim().toLowerCase() || // check if the name is the same as already is
          "Application already exists!",
      ];
    },
    // appName() {
    //   return this.appEditValue.name;
    // },
    // appUrls() {
    //   return this.appEditValue.urls;
    // },
  },
  created() {
    this.appName = this.appEditValue.name;
    this.appUrls = this.appEditValue.urls.toString().replaceAll(",", "\n");
  },
  mounted() {
    // window.addEventListener("keyup", (e) => {
    //   if (
    //     e.key === "Enter" ||
    //     e.key === " " ||
    //     e.key === "Spacebar" ||
    //     e.key === "Space bar"
    //   ) {
    //     this.$refs.btnDialogEditAppY.$el.click();
    //   }
    // });
    // this.appName = this.appEditValue.name;
    // this.appUrls = this.appEditValue.urls;
  },
  methods: {
    hideDialog() {
      this.$store.dispatch('ui/toggleDialog', { type: 'APP_EDIT_DIALOG', val: false });
      this.$store.dispatch("app/setAppEditValue", "");
    },
    editApp() {
      this.$refs.formAppEdit.validate();
      if (this.formAppEdit) {
        this.$store.dispatch("app/editApp", {
          name: this.appName,
          urls: this.$globals.lodash.compact(this.appUrls.trim().split("\n")),
          oldName: this.appEditValue.name,
        });
        this.$refs.formAppEdit.reset();
        this.hideDialog();
      }
    },
  },
};
</script>

<style>
</style>