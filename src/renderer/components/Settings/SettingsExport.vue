<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="primary--text mb-1"> mdi-export mdi-flip-h </v-icon>
          Export accounts
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Export all of your accounts into number of file formats.
        </v-list-item-subtitle>
      </v-list-item-content>
      <div class="ms-2" style="max-width: 180px">
        <v-dialog v-model="dialog" max-width="420px">
          <template #activator="{ on, attrs }">
            <v-btn
              class="ms-2"
              max-width="240"
              large
              color="primary"
              style="text-overflow: ellipsis !important"
              v-bind="attrs"
              v-on="on"
            >
              Export
            </v-btn>
          </template>
          <v-card outlined>
            <v-card-title class="primary--text">
              Choose file format
            </v-card-title>
            <v-form
              ref="formExportAccs"
              v-model="formExportAccs"
              @submit.prevent="exportAccs()"
            >
              <v-card-text class="pb-0">
                <v-select
                  v-model="fileFormatModel"
                  :items="fileFormatItems"
                  prepend-icon="mdi-file"
                  :rules="[(v) => !!v || 'Please choose file format']"
                  outlined
                  label="Choose File Format"
                >
                </v-select>
              </v-card-text>
            </v-form>
            <v-card-actions class="px-6 pb-6">
              <v-spacer />
              <v-btn ref="btnDialogPdlN" outlined @click="toggleDialog()">
                Cancel
              </v-btn>
              <v-btn ref="btnDialogPdlY" color="primary" @click="exportAccs()">
                EXPORT
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      fileFormatModel: "",
      formExportAccs: false,
    };
  },
  computed: {
    ...mapState("settings", ["reminderFreq"]),
    reminderFreqModel: {
      get() {
        const v = this.reminderFreq;
        return v + (v * 1 === 1 ? " month" : " months");
      },
      set(v) {
        this.$store.dispatch("settings/setReminderFreq", v);
      },
    },
    fileFormatItems() {
      const ff = [".JSON", ".TXT", ".CSV", ".XLS"];
      return ff;
    },
  },
  methods: {
    toggleDialog() {
      this.dialog = !this.dialog;
    },
    exportAccs() {
      this.$refs.formExportAccs.validate();
      if (this.formExportAccs) {
        const accList = JSON.stringify(this.$store.state.account.accountList);
        // alert("downloaded");
        const renderer = require("electron").ipcRenderer;
        renderer.send(
          "download-button",
          "https://www.gravatar.com/avatar/fdfdfa8555bef13e9a29f8d804e96aac?s=64&d=identicon&r=PG"
        );
        // this.dlFile(accList);

        this.toggleDialog();
      }
    },
    async dlFile(accList) {
      const { BrowserWindow, ipcMain } = require("electron").remote;
      console.log(require("electron"));
      const { download } = require("electron-dl");

      const url = "data:text/json;charset=utf-8," + encodeURIComponent(accList);
      await download(
        BrowserWindow.getFocusedWindow(),
        "https://www.gravatar.com/avatar/fdfdfa8555bef13e9a29f8d804e96aac?s=64&d=identicon&r=PG",
        {
          filename: this.$date.moment(),
        }
      );
      // ipcMain.on("download-button", async (event, { url }) => {
      //   const win = BrowserWindow.getFocusedWindow();
      //   console.log(await download(win, url));
      // });
    },
  },
};
</script>

<style>
</style>