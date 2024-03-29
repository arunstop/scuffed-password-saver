<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="primary--text mb-1"> mdi-upload-multiple </v-icon>
          Export accounts
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Export all of your accounts into number of file formats into your
          device or Google Drive account.
        </v-list-item-subtitle>
      </v-list-item-content>
      <div class="ms-2" style="max-width: 180px">
        <v-dialog
          v-model="dialog"
          max-width="600px"
          transition="slide-y-reverse-transition"
          :persistent="isLoading"
        >
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
            <UtilLoadingOverlay
              :show="isLoading"
              :label="'Saving backup file...'"
            />
            <v-card-title class="primary--text">
              Choose file format
            </v-card-title>
            <v-form
              ref="formExportAccs"
              v-model="formExportAccs"
              @submit.prevent="exportAccs()"
            >
              <v-card-text class="pb-0 mb-6">
                <v-select
                  v-model="fileFormatModel"
                  :items="fileFormatItems"
                  prepend-icon="mdi-file"
                  :rules="[(v) => !!v || 'Please choose file format']"
                  outlined
                  label="Choose File Format"
                />

                <v-list-item class="px-0">
                  <v-list-item-icon class="ma-0 me-2 my-auto">
                    <v-icon> mdi-crosshairs-gps </v-icon>
                  </v-list-item-icon>
                  <v-item-group v-model="destinationModel" mandatory>
                    <div class="mb-2 subtitle-1 font-weight-medium">
                      Backup Destination :
                    </div>
                    <v-item
                      v-for="dest in destinationList"
                      :key="dest.val"
                      v-slot="{ active, toggle }"
                      :value="dest.val"
                    >
                      <v-btn
                        class="me-2 mb-2 font-weight-medium"
                        :class="active ? 'primary' : ''"
                        :outlined="!active"
                        large
                        :input-value="active"
                        @click="toggle"
                      >
                        <v-icon left>{{ dest.icon }}</v-icon>
                        {{ dest.label }}
                      </v-btn>
                    </v-item>
                  </v-item-group>
                </v-list-item>
              </v-card-text>
            </v-form>
            <v-card-actions class="px-6 pb-6">
              <v-spacer />
              <v-btn ref="btnDialogPdlN" outlined @click="toggleDialog()">
                Cancel
              </v-btn>
              <v-btn
                ref="btnDialogPdlY"
                :disabled="!formExportAccs"
                color="primary"
                @click="exportAccs()"
              >
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
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      isLoading: false,
      fileFormatModel: "",
      formExportAccs: false,
      destinationModel: "",
      destinationList: [
        { val: "my-device", label: "My Device", icon: "mdi-monitor" },
        { val: "g-drive", label: "Google Drive", icon: "mdi-google-drive" },
      ],
    };
  },
  computed: {
    ...mapState("settings", ["reminderFreq", "vaultPath"]),
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
      const ff = [".JSON", ".TXT", ".CSV"];
      return ff;
    },
  },
  methods: {
    toggleDialog() {
      this.fileFormatModel = "";
      this.destinationModel = "";
      this.isLoading = false;
      this.dialog = !this.dialog;
    },
    exportAccs() {
      this.$refs.formExportAccs.validate();
      if (this.formExportAccs) {
        this.isLoading = true;

        // if token expired, set the token first
        const isExpired =
          this.$date.moment().format("x") >
          this.$store.state.settings.gapiToken.expiry_date;

        const ext = this.fileFormatModel.toLowerCase();

        // add accountTags
        const normalizeProps = (list) => {
          return list.map((e) => {
            if (!e.accountTags)
              require("lodash").assign(e, { accountTags: "" });
            return e;
          });
        };
        // console.log();
        const backupFile = this.$globals.getBackupAccountFile(
          ext,
          normalizeProps(this.$store.state.account.accountList),
          true
        );

        if (this.destinationModel === "my-device") {
          // If offline
          this.$globals.download({
            url: backupFile.data,
            filename: backupFile.name,
            directory: this.vaultPath,
            successAction: (path) => {
              this.$store.dispatch("ui/showSnackbar", {
                label: "Exported to vault successfully",
                color: "success",
              });
              this.toggleDialog();
            },
          });
        } else if (this.destinationModel === "g-drive") {
          // If google drive

          if (this.$store.state.settings.gapiToken === "") {
            this.$store.dispatch("ui/showSnackbar", {
              label: "Google account needs to be set first.",
              color: "error",
            });
            this.$nuxt.$emit("showDriveAuthDialog");
            this.toggleDialog();
            return;
          }

          this.$API_gdrive.backupToDrive(
            ext,
            normalizeProps(this.$store.state.account.accountList),
            (error = null, result) => {
              if (error) {
                this.$store.dispatch("ui/showSnackbar", {
                  label: error,
                  color: "error",
                });
              }
              // IF SUCCESS
              else {
                this.$store.dispatch("ui/showSnackbar", {
                  label:
                    "Backup file has been created in your Google Drive Account",
                  color: "success",
                });
              }
              this.toggleDialog();
            }
          );
        }
      }
    },
  },
};
</script>

<style>
</style>
