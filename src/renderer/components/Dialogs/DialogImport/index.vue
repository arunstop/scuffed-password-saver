<template>
  <v-dialog v-model="importDialog" max-width="600">
    <v-card outlined>
      <v-card-title class="primary--text">Import accounts</v-card-title>
      <v-card-text>
        <!-- HIDDEN FILE INPUT -->
        <v-file-input
          ref="importFileInput"
          v-model="filesPseudo"
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
          <template #selection="{ index, text }">
            <v-chip color="primary accent-4" label small>
              {{ index + 1 + ". " + text }}
            </v-chip>
          </template>
        </v-file-input>
        <v-expand-transition>
          <!-- IMPORT PANEL -->
          <v-card
            v-if="!files.length"
            v-bind="importPanel.loading"
            outlined
            height="300"
            class=""
            :color="importPanel.color"
            @click="uploadFiles()"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
          >
            <div class="d-flex align-center justify-center fill-height">
              <div class="text-center" :class="importPanel.button">
                <v-btn color="primary" large>
                  UPLOAD
                  <v-icon>mdi-upload</v-icon>
                </v-btn>

                <h4 class="mt-4">Click the button above or drag files here.</h4>
              </div>
            </div>
          </v-card>
          <div v-else>
            <v-card class="mb-4" outlined>
              <v-card
                class="my-4 overflow-y-scroll elevation-0"
                color="transparent"
                max-height="300"
              >
                <v-fade-transition
                  class="d-flex ps-4 justify-space-between flex-wrap"
                  group
                >
                  <v-chip
                    v-for="(file, index) in fileList"
                    :key="file.name"
                    class="ma-2 py-2 white--text"
                    color="indigo"
                    label
                    close
                    @click:close="removeFile(file.name)"
                  >
                    <span class="text-truncate">{{
                      index + 1 + ". " + file.name
                    }}</span>
                    <span class="ms-1 text-decoration-underline">
                      {{ file.accList.length + " accounts" }}
                    </span>
                  </v-chip>
                </v-fade-transition>
              </v-card>

              <v-divider />
              <div class="pa-4 text-right">
                <v-btn
                  class="ms-1"
                  color="error"
                  small
                  outlined
                  rounded
                  @click="clearFiles()"
                >
                  Clear
                  <v-icon right>mdi-close</v-icon>
                </v-btn>
                <v-btn
                  class="ms-1"
                  color="primary"
                  small
                  outlined
                  rounded
                  @click="uploadFiles()"
                >
                  Add
                  <v-icon right>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card>
            <DialogImportAlert
              v-for="(alert, index) in alertList"
              :key="index"
              :type="alert.type"
              :icon="alert.icon"
              :message="alert.message"
            />

            <v-radio-group v-model="option" mandatory>
              <v-radio
                v-for="(mode, index) in modeList"
                :key="index"
                v-bind="mode"
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
          :disabled="!uploadResult.totalUnique"
          @click.stop="importAccounts()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      filesPseudo: [],
      files: [],
      option: "",
      importPanel: { color: "", button: "", loading: {} },
    };
  },
  computed: {
    ...mapState("account", ["accountList"]),
    importDialog: {
      get() {
        return this.$store.state.ui.importDialog;
      },
      set(v) {
        this.hideDialog();
      },
    },
    fileList() {
      const fileDetailList = [];
      this.files.forEach((e) => {
        const accList = this.getAccountList(e);
        // console.log(this.$globals.lodash.assign(e, { accList }));
        fileDetailList.push(this.$globals.lodash.assign(e, { accList }));
      });
      return fileDetailList || [];
    },
    uploadResult() {
      const _ = this.$globals.lodash;
      const alRaw = this.fileList
        .map((e) => e.accList)
        .reduce((p, c) => p.concat(c), []);
      const al = _.uniqBy(alRaw, "id");

      const alDuplicate = _.intersectionBy(_.clone(al), this.accountList, "id");
      const alNew = _.pullAllBy(_.clone(al), this.accountList, "id");

      return {
        accountList: al,
        accountListNew: alNew,
        accountListDuplicate: alDuplicate,
        total: alRaw.length,
        totalUnique: al.length,
        totalNew: alNew.length,
        totalDuplicate: alDuplicate.length,
      };
    },
    alertList() {
      const importTypeAlert = () => {
        if (this.option === "REPLACE_ADD")
          return {
            type: "warning",
            icon: "mdi-swap-horizontal",
            message: `<b>${this.uploadResult.totalDuplicate}</b> existing/duplicate accounts will be replaced <br> 
            <b>${this.uploadResult.totalNew}</b> new account(s) will be added`,
          };
        if (this.option === "REPLACE")
          return {
            type: "warning",
            icon: "mdi-swap-horizontal",
            message: `<b>${this.uploadResult.totalDuplicate}</b> duplicate accounts will be replaced`,
          };
        else if (this.option === "ADD")
          return {
            type: "success",
            icon: "mdi-plus",
            message: `<b>${this.uploadResult.totalNew}</b> new account(s) will be added`,
          };
        return null;
      };

      const res = [
        {
          type: this.uploadResult.total ? "info" : "error",
          icon: "mdi-magnify",
          message: `<b>${this.uploadResult.total}</b> accounts scanned from uploaded files`,
        },

        {
          type: this.uploadResult.totalUnique ? "info" : "error",
          icon: "mdi-counter",
          message: `<b>${this.uploadResult.totalUnique}</b> unique accounts found`,
        },

        {
          type: this.uploadResult.totalDuplicate ? "success" : "error",
          icon: "mdi-content-copy",
          message: `<b>${this.uploadResult.totalDuplicate}</b> existing/duplicate accounts found`,
        },

        {
          type: this.uploadResult.totalNew ? "info" : "error",
          icon: "mdi-new-box",
          message: `<b>${this.uploadResult.totalNew}</b> new accounts found`,
        },
        importTypeAlert(),
      ];

      return this.$globals.lodash.compact(res);
    },
    modeList() {
      return [
        {
          value: "REPLACE",
          label:
            "Replace existing/duplicate accounts ONLY (" +
            this.uploadResult.totalDuplicate +
            " accounts)",
          disabled: false,
        },
        {
          value: "REPLACE_ADD",
          label:
            "Replace ALL duplicates & add NEW ones (" +
            this.uploadResult.totalUnique +
            " accounts)",
          disabled: !this.uploadResult.totalNew,
        },
        {
          value: "ADD",
          label:
            "ONLY add new accounts (" +
            this.uploadResult.totalNew +
            " accounts)",
          disabled: !this.uploadResult.totalNew,
        },
      ];
    },
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleImportDialog", false);
    },
    getAccountList(file) {
      const fs = require("fs");
      return JSON.parse(fs.readFileSync(file.path));
    },
    clearFiles() {
      this.files = [];
    },
    removeFile(name) {
      this.files = this.files.filter((e) => e.name !== name);
    },
    uploadFiles() {
      this.$refs.importFileInput.$refs.input.click();
    },
    onchange(event) {
      if (!event.target.files.length) return;
      const fetchedFiles = Array.from(event.target.files);
      // console.log(this.files);
      if (!this.files.length) {
        this.files = fetchedFiles;
        return;
      }
      fetchedFiles.forEach((e) => {
        if (!this.files.find((f) => f.path === e.path)) this.files.push(e);
      });
      // console.log(this.files);
    },
    toggleImportPanelLoading(v) {
      if (v) {
        this.importPanel.loading = { loading: true, disabled: true };
      }
      this.importPanel.loading = {};
    },
    toggleImportPanel(v) {
      if (v) {
        this.importPanel.color = "indigo";
        this.importPanel.button = "pointer-events-none";
        return;
      }
      this.importPanel.color = "";
      this.importPanel.button = "";
    },
    dragover(event) {
      event.preventDefault();
      this.toggleImportPanel(true);
    },
    dragleave(event) {
      event.preventDefault();
      this.toggleImportPanel(false);
    },
    async drop(event) {
      event.preventDefault();
      this.toggleImportPanelLoading(true);
      const fileList = Array.from(event.dataTransfer.files);
      const validFiles = fileList.filter(
        (e) => e.name.toLowerCase().trim().split(".").reverse()[0] === "json"
      );
      this.importPanelColor = "";
      this.files = validFiles;
      this.toggleImportPanelLoading(false);
      this.toggleImportPanel(false);
    },
    importAccounts() {
      const payload = { value: [], mode: this.option };
      if (this.option === "REPLACE") {
        payload.value = this.uploadResult.accountListDuplicate;
      } else if (this.option === "REPLACE_ADD") {
        payload.value = this.uploadResult.accountList;
      } else if (this.option === "ADD") {
        payload.value = this.uploadResult.accountListNew;
      }
      this.$store.dispatch("account/importAccount", payload);
      // const fs = require("fs");
      // console.log(JSON.parse(fs.readFileSync(this.files.path)));
      //   this.$store.dispatch("ui/toggleimportDialog", false);
      // remote.getCurrentWindow().close()
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
.chip-file {
  white-space: nowrap;
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>