<template>
  <v-dialog v-model="importDialog" max-width="600">
    <v-card outlined>
      <v-card-title class="primary--text">Import accounts</v-card-title>
      <v-card-text>
        <v-file-input
          ref="importFileInput"
          v-model="files"
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
        >
          <template #selection="{ index, text }">
            <v-chip color="primary accent-4" label small>
              {{ index + 1 + ". " + text }}
            </v-chip>
          </template>
        </v-file-input>
        <v-expand-transition>
          <v-card
            v-if="!files.length"
            outlined
            height="300"
            class="d-flex align-center justify-center"
            :color="importPanelColor"
             @click="uploadFiles()"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
          >
            <div class="text-center" style="pointer-events:none;">
              <v-btn color="primary" large>
                UPLOAD
                <v-icon>mdi-upload</v-icon>
              </v-btn>

              <h4 class="mt-4">
                Click the button above or drag files here.
              </h4>
            </div>
          </v-card>
          <div v-else>
            <v-card class="my-4" outlined>
              <div class="d-flex justify-space-between flex-wrap px-2 py-4">
                <v-scale-transition group>
                  <v-chip
                  v-for="(file, index) in fileList"
                  :key="file.name"
                  class="ma-2 py-2 white--text"
                  color="indigo"
                  label
                  close
                  style="max-width: 240px"
                  @click:close="removeFile(file.name)"
                >
                  <span class="text-truncate">{{
                    index + 1 + ". " + file.name
                  }}</span>
                  <span class="ms-1 text-decoration-underline">
                    {{ file.accList.length + " accounts" }}
                  </span>
                </v-chip>
                </v-scale-transition>
              </div>
              <v-divider />
              <div class="pa-4 text-right">
                <v-btn
                  class="ms-1"
                  color="error"
                  small
                  outlined
                  rounded
                  @click="files = []"
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
                  Edit
                  <v-icon right>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-card>
            <v-alert type="info" icon="mdi-magnify" text border="left">
              {{ `${totalAccounts.total} accounts found` }}
              <br />
              {{ `${totalAccounts.total} duplicate accounts found` }}
              <br />
              {{ `${totalAccounts.total} new accounts found` }}
            </v-alert>
            <v-alert
              v-if="files.length && option === 0"
              type="warning"
              icon="mdi-content-copy"
              text
              border="left"
            >
              {{ `11 duplicate accounts will be replaced` }}
            </v-alert>
            <v-alert
              v-if="files.length && option === 1"
              type="success"
              icon="mdi-plus"
              text
              border="left"
            >
              {{ `11 new accounts will be added` }}
            </v-alert>
            <v-radio-group v-model="option" mandatory>
              <v-radio
                :label="
                  'Replace existing duplicate accounts (' +
                  totalAccounts.total +
                  ' accounts)'
                "
              />
              <v-radio
                :label="
                  'Only add new accounts (' + totalAccounts.total + ' accounts)'
                "
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
          :disabled="files.length === 0"
          @click.stop="importAccounts()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { remote } from "electron";
export default {
  data() {
    return {
      files: [],
      option: "",
      importPanelColor:'',
    };
  },
  computed: {
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
        console.log(this.$globals.lodash.assign(e, { accList }));
        fileDetailList.push(this.$globals.lodash.assign(e, { accList }));
      });
      return fileDetailList || [];
    },
    totalAccounts() {
      return {
        total: this.fileList.reduce(
          (prev, curr) => prev + curr.accList.length,
          0 // initializer
        ),
      };
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
    //     this.$refs.btnDialogLogoutY.$el.click();
    //   }
    // });
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleImportDialog", false);
    },
    importAccounts() {
      console.log(this.files);
      // const fs = require("fs");
      // console.log(JSON.parse(fs.readFileSync(this.files.path)));
      //   this.$store.dispatch("ui/toggleimportDialog", false);
      // remote.getCurrentWindow().close()
      alert("import account");
    },
    getAccountList(file) {
      const fs = require("fs");
      return JSON.parse(fs.readFileSync(file.path));
    },
    removeFile(name) {
      this.files = this.files.filter((e) => e.name !== name);
    },
    uploadFiles() {
      this.$refs.importFileInput.$refs.input.click();
    },
    dragover(event){
      event.preventDefault()
      this.importPanelColor='indigo'
    },
    dragleave(event){
      event.preventDefault()
      this.importPanelColor=''
    },
    drop(event){
      event.preventDefault()
      const fileList = Array.from(event.dataTransfer.files)
      const validFiles = fileList.filter(e=>e.name.toLowerCase().trim().split('.').reverse()[0]==='json')
      this.importPanelColor=''
      this.files= validFiles
    }
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