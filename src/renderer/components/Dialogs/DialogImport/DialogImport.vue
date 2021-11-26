<template>
  <v-dialog
    v-model="importDialog"
    max-width="600"
    scrollable
    :fullscreen="
      $vuetify.breakpoint.smAndDown && fileAccountList.length ? true : false
    "
    transition="slide-y-reverse-transition"
    :persistent="isLoading"
  >
    <v-card outlined>
      <UtilOverlay :show="isLoading" :label="loadingLabel" />
      <v-card-title class="primary--text">
        Import accounts
        <UtilDialogCloseBtn :action="() => hideDialog()" />
      </v-card-title>
      <v-card-text>
        <!-- HIDDEN FILE INPUT -->
        <v-file-input
          ref="importFileInput"
          v-model="filesRaw"
          class="d-none"
          color="primary accent-4"
          counter
          prepend-icon="mdi-paperclip"
          outlined
          multiple
          :show-size="1000"
          accept=".json,.txt,.csv,.xls"
          @change.native="onchange"
        >
          <!-- <template #selection="{ index, text }">
            <v-chip color="primary accent-4" label small>
              {{ index + 1 + ". " + text }}
            </v-chip>
          </template> -->
        </v-file-input>
        <v-expand-transition>
          <!-- IMPORT PANEL -->
          <DialogImportUploadPanel v-if="!fileAccountList.length" />
          <div v-else>
            <DialogImportFileListPanel />
            <DialogImportAlert
              v-for="(alert, index) in getAlertList(option)"
              :key="index"
              :type="alert.type"
              :icon="alert.icon"
              :message="alert.message"
            />
            <v-radio-group v-model="option" mandatory hide-details="">
              <v-radio
                v-for="(mode, index) in getModeList()"
                :key="index"
                v-bind="mode"
              />
            </v-radio-group>
          </div>
        </v-expand-transition>
        <v-card-actions class="d-flex px-0 mt-4">
          <v-btn
            ref="btnDialogLogoutN"
            class="flex-grow-1"
            outlined
            @click.stop="hideDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            ref="btnDialogLogoutY"
            class="flex-grow-1"
            color="primary"
            :disabled="!getUploadResult().totalUnique"
            @click.stop="importAccounts()"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loadingLabel:'Scanning accounts...',
      option: "",
      importPanel: { color: "", button: "", loading: {} },
    };
  },
  computed: {
    ...mapGetters("ui/dialogImport", [
      "getUploadResult",
      "getAlertList",
      "getModeList",
    ]),
    ...mapState("ui/dialogImport", ["isLoading"]),
    ...mapState("account", ["accountList"]),
    importDialog: {
      get() {
        return this.$store.getters["ui/isDialogActive"]("IMPORT_DIALOG");
      },
      set(v) {
        this.hideDialog();
      },
    },
    // isLoading: {
    //   get() {
    //     return this.$store.state.ui.dialogImport.isLoading;
    //   },
    //   set(v) {
    //     this.$store.dispatch("ui/dialogImport/setLoading", v);
    //   },
    // },
    // FILES RAW to make input Files empty after clearing OK
    filesRaw: {
      get() {
        return this.$store.state.ui.dialogImport.filesRaw;
      },
      set(v) {
        this.$store.dispatch("ui/dialogImport/setFilesRaw", v);
      },
    },
    fileAccountList: {
      get() {
        return this.$store.state.ui.dialogImport.fileAccountList;
      },
      set(v) {
        this.$store.dispatch("ui/dialogImport/setFileAccountList", v);
      },
    },
  },
  created() {
    // event to click hidden input file
    this.$nuxt.$on("clickImportFileInput", () => {
      this.$refs.importFileInput.$refs.input.click();
    });
  },
  beforeDestroy() {
    this.$store.dispatch("ui/dialogImport/clearFiles");

    // removing eventBus listener
    this.$nuxt.$off("clickImportFileInput");
  },
  methods: {
    ...mapActions("ui/dialogImport", ["setIsLoading"]),
    hideDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: "IMPORT_DIALOG",
        val: false,
      });
    },
    onchange(event) {
      // if cancel click
      if (!event.target.files.length) {
        return;
      }
      const fetchedFiles = Array.from(event.target.files);
      // console.log(this.fileAccountList);
      if (!this.fileAccountList.length) {
        this.fileAccountList = fetchedFiles;
        return;
      }
      const _ = require("lodash");
      console.log(_.unionBy(this.fileAccountList, fetchedFiles, "path"));
      this.fileAccountList = _.unionBy(
        this.fileAccountList,
        fetchedFiles,
        "path"
      );
    },
    importAccounts() {
      this.loadingLabel = 'Importing accounts...'
      this.setIsLoading(true);

      setTimeout(() => {
        const payload = { value: [], mode: this.option };
        if (this.option === "REPLACE") {
          payload.value = this.getUploadResult().accountListDuplicate;
        } else if (this.option === "REPLACE_ADD") {
          payload.value = this.getUploadResult().accountList;
        } else if (this.option === "ADD") {
          payload.value = this.getUploadResult().accountListNew;
        }

        this.$store.dispatch("account/importAccount", payload);
        this.hideDialog();
        this.$store.dispatch("ui/showSnackbar", {
          label: "Accounts has been imported successfully!",
          color: "success",
        });
        this.setIsLoading(false);
      }, 1212);
    },
  },
};
</script>

<style>
</style>
