<template>
  <v-dialog
    v-model="importDialog"
    max-width="600"
    scrollable
    :fullscreen="$vuetify.breakpoint.smAndDown"
    transition="slide-y-reverse-transition"
  >
    <v-card outlined>
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
          label="Choose a backup file"
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          outlined
          multiple
          :show-size="1000"
          accept=".json"
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
          <DialogImportUploadPanel v-if="!files.length" />
          <div v-else>
            <DialogImportFileListPanel />
            <DialogImportAlert
              v-for="(alert, index) in getAlertList(option)"
              :key="index"
              :type="alert.type"
              :icon="alert.icon"
              :message="alert.message"
            />
            <v-radio-group v-model="option" mandatory>
              <v-radio
                v-for="(mode, index) in getModeList()"
                :key="index"
                v-bind="mode"
                clas
              />
            </v-radio-group>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-card-actions class="d-flex justify-end pb-4">
        <v-btn ref="btnDialogLogoutN" outlined @click.stop="hideDialog()">
          Cancel
        </v-btn>
        <v-btn
          ref="btnDialogLogoutY"
          color="primary"
          :disabled="!getUploadResult().totalUnique"
          @click.stop="importAccounts()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      option: "",
      importPanel: { color: "", button: "", loading: {} },
    };
  },
  computed: {
    ...mapGetters("ui/dialogImport", [
      "getFileList",
      "getUploadResult",
      "getAlertList",
      "getModeList",
    ]),
    ...mapState("account", ["accountList"]),
    importDialog: {
      get() {
        return this.$store.getters["ui/isDialogActive"]("IMPORT_DIALOG");
      },
      set(v) {
        this.hideDialog();
      },
    },
    filesRaw: {
      get() {
        return this.$store.state.ui.dialogImport.filesRaw;
      },
      set(v) {
        this.$store.dispatch("ui/dialogImport/setFilesRaw", v);
      },
    },
    files: {
      get() {
        return this.$store.state.ui.dialogImport.files;
      },
      set(v) {
        this.$store.dispatch("ui/dialogImport/setFiles", v);
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
    hideDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: "IMPORT_DIALOG",
        val: false,
      });
    },
    onchange(event) {
      if (!event.target.files.length) return;
      const fetchedFiles = Array.from(event.target.files);
      // console.log(this.files);
      if (!this.files.length) {
        this.files = fetchedFiles;
        return;
      }
      const _ = require("lodash");
      this.files = _.unionBy(this.files, fetchedFiles, "path");
    },
    importAccounts() {
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
    },
  },
};
</script>

<style>
</style>