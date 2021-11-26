<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="mb-1" :class="!driveToken || 'primary--text'">
            mdi-google-drive
          </v-icon>
          Set up Google Drive Authorization
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Set up your Google Drive Authorization to set up Google Drive Backup.
        </v-list-item-subtitle>
      </v-list-item-content>

      <div style="max-width: 180px">
        <v-dialog v-model="dialog" max-width="600px">
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
              Set up Google Drive Authorization
            </v-card-title>
            <v-form
              ref="formSetDriveApi"
              v-model="formSetDriveApi"
              @submit="setPwDupLimit()"
            >
              <v-card-text class="pb-0">
                <v-alert type="info" dense text>
                  <span>
                    In order to make enable Google Drive backup, first you must
                    authorize this app into your Google Drive account :
                  </span>
                  <br />
                  <v-btn
                    class="mt-2"
                    color="orange"
                    v-bind="btnLinkProps"
                    @click="goToLink()"
                  >
                    Authorize
                    <v-icon right size="20">mdi-open-in-new</v-icon>
                  </v-btn>
                </v-alert>
                <v-text-field
                  v-model="driveTokenModel"
                  :rules="driveTokenRules"
                  class="mt-4 mb-0"
                  autofocus
                  outlined
                  prepend-icon="mdi-key"
                  label="Authorization Code"
                  placeholder="Enter Authorization Code"
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
                @click="setDriveToken()"
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
      driveTokenModel: "",
      formSetDriveApi: false,
      btnLinkProps: {},
    };
  },
  computed: {
    ...mapState("settings", ["driveToken"]),
    driveTokenRules: () => [(v) => !!v.trim() || "Key cannot be empty"],
  },
  created() {
    this.driveTokenModel = "";
  },
  methods: {
    hideDialog() {
      this.dialog = !this.dialog;
    },
    setDriveToken() {
      this.$refs.formSetDriveApi.validate();
      if (this.formSetDriveApi) {
        this.$API_gdrive.getToken(this.driveTokenModel);
        this.hideDialog();
      }
    },
    goToLink() {
      this.$API_gdrive.init();
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
