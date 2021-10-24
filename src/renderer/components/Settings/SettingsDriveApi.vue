<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="mb-1" :class="!driveKey || 'primary--text'">
            mdi-google-drive
          </v-icon>
          Google Drive API Key
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Set up your Google Drive API Key to set up Google Drive Backup.
        </v-list-item-subtitle>
      </v-list-item-content>

      <div style="max-width: 180px">
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
              change
            </v-btn>
          </template>
          <v-card outlined>
            <v-card-title class="primary--text">
              Set up Google Drive API KEY
            </v-card-title>
            <v-form
              ref="formSetDriveApi"
              v-model="formSetDriveApi"
              @submit="setPwDupLimit()"
            >
              <v-card-text class="pb-0">
                <v-alert type="info" dense text>
                  <span>
                    Follow this link to create your Google Drive API Key :
                  </span>
                  <br />
                  <v-btn
                    class="mt-2"
                    color="orange"
                    small
                    v-bind="btnLinkProps"
                    @click="goToLink()"
                  >
                    Create
                    <v-icon right size="20">mdi-open-in-new</v-icon>
                  </v-btn>
                </v-alert>
                <v-text-field
                  v-model="driveKeyModel"
                  :rules="keyRules"
                  class="mt-4 mb-0"
                  autofocus
                  outlined
                  prepend-icon="mdi-key"
                  label="Google Drive API Key"
                  placeholder="Enter Google Drive API Key"
                />
              </v-card-text>
            </v-form>
            <v-card-actions class="px-6 pb-6">
              <v-spacer />
              <v-btn ref="btnDialogDaN" outlined @click="hideDialog()">
                Cancel
              </v-btn>
              <v-btn
                ref="btnDialogDaY"
                color="primary"
                :disabled="!formSetDriveApi"
                @click="setDriveKey()"
              >
                OK
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
      driveKeyModel: "",
      formSetDriveApi: false,
      btnLinkProps: {},
    };
  },
  computed: {
    ...mapState("settings", ["driveKey"]),
    keyRules: () => [(v) => !!v.trim() || "Key cannot be empty"],
  },
  created() {
    this.driveKeyModel = this.driveKey;
  },
  methods: {
    hideDialog() {
      this.dialog = !this.dialog;
    },
    setDriveKey() {
      this.$refs.formSetDriveApi.validate();
      if (this.formSetDriveApi) {
        this.$store.dispatch("settings/setDriveKey", this.driveKeyModel);
        this.hideDialog();
      }
    },
    goToLink() {
      this.$globals.openUrl("https://developers.google.com/drive/api/v3/enable-drive-api#enable_the_drive_api")
      this.btnLinkProps = {
        loading: true,
        disabled: true,
      };
      setTimeout(() => {
        this.btnLinkProps = {};
      }, 2000);
    },
  },
};
</script>

<style>
</style>