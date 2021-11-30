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
              change
            </v-btn>
          </template>
          <v-card outlined>
            <UtilLoadingOverlay :show="isLoading" :label="isLoadingLabel" />
            <v-card-title class="primary--text">
              Set up Google Drive Authorization
            </v-card-title>
            <v-form
              ref="formSetDriveApi"
              v-model="formSetDriveApi"
              @submit="setDriveToken()"
            >
              <v-card-text class="pb-0">
                <!-- {{$store.state.settings.driveToken}} -->
                <v-fade-transition leave-absolute group>
                  <v-alert
                    v-if="!isAuthed"
                    key="alertDialogDaNoAccess"
                    type="info"
                    prominent
                    dense
                    text
                  >
                    <div>
                      In order to make enable Google Drive backup, first you
                      must authorize this app into your Google Drive account :
                    </div>
                    <v-btn
                      v-if="!isAuthed"
                      class="mt-2"
                      large
                      color="success"
                      v-bind="btnLinkProps"
                      @click.stop="goToLink()"
                    >
                      Authorize access
                      <v-icon right size="20">mdi-open-in-new</v-icon>
                    </v-btn>
                  </v-alert>
                  <v-alert
                    v-if="isAuthed && !isExpired"
                    key="alertDialogDaHasAccess"
                    type="success"
                    prominent
                    dense
                    text
                  >
                    <div>
                      You have authorized this app into your Google Drive
                      account, now you can backup data to it.
                      <br />
                      <v-chip v-if="!driveToken.refresh_token" class="my-2" label color="orange" outlined>
                        Expiration Date :
                        <span
                          class="
                            ms-2
                            font-weight-bold
                            text-decoration-underline
                          "
                        >
                          {{ tokenExpiryDate }}
                        </span>
                      </v-chip>
                    </div>
                    <v-btn
                      class="mt-2"
                      large
                      color="error"
                      v-bind="btnLinkProps"
                      @click="removeAccess()"
                    >
                      Remove access
                      <v-icon right size="20">mdi-close-thick</v-icon>
                    </v-btn>
                  </v-alert>
                  <v-alert
                    v-if="isAuthed && isExpired"
                    key="alertDialogDaExpired"
                    type="error"
                    prominent
                    dense
                    text
                  >
                    <div>
                      Your authorization access has expired at
                      <span
                        class="ms-2 font-weight-bold text-decoration-underline"
                      >
                        {{ tokenExpiryDate }} </span
                      >. Please do redo the authorization process.
                    </div>
                    <v-btn
                      v-if="isAuthed"
                      class="mt-2"
                      large
                      color="info"
                      v-bind="btnLinkProps"
                      @click="reauthorize()"
                    >
                      Re-Authorize
                      <v-icon right size="20">mdi-reload</v-icon>
                    </v-btn>
                  </v-alert>
                  <v-text-field
                    v-if="!isAuthed"
                    key="inputDialogDaNoAccess"
                    v-model="driveTokenModel"
                    :rules="driveTokenRules"
                    class="mt-4 mb-0"
                    autofocus
                    outlined
                    prepend-icon="mdi-key"
                    label="Authorization Code"
                    placeholder="Enter Authorization Code"
                  />
                </v-fade-transition>
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
                {{ isAuthed ? "OK" : "Authorize" }}
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
      isLoading: false,
      isLoadingLabel: "",
      driveTokenModel: "",
      formSetDriveApi: false,
      btnLinkProps: {},
      // isAuthed: false,
    };
  },
  computed: {
    ...mapState("settings", ["driveToken"]),
    driveTokenRules: () => [
      (v) => !!v.trim() || "Authorization code cannot be empty",
    ],
    isAuthed() {
      return this.$store.state.settings.driveToken.access_token && true;
    },
    isExpired() {
      return this.$date.moment().format("x") > this.driveToken.expiry_date && !this.driveToken.refresh_token;
    },
    tokenExpiryDate() {
      return this.$date
        .moment(this.driveToken.expiry_date)
        .format("dddd, DD MMMM YYYY [at] HH:mm");
    },
  },
  created() {
    this.driveTokenModel = "";
    // console.log(this.$store.state.settings.driveToken.access_token)
  },
  methods: {
    hideDialog() {
      this.dialog = !this.dialog;
    },
    setDriveToken() {
      if (this.isAuthed) {
        return this.hideDialog();
      }
      this.$refs.formSetDriveApi.validate();
      if (this.formSetDriveApi) {
        this.isLoadingLabel = "Validating the code...";
        this.isLoading = true;
        setTimeout(() => {
          this.$API_gdrive.authorizeAccess(this.driveTokenModel, (err) => {
            if (err) {
              this.$store.dispatch("ui/showSnackbar", {
                label: "Error retrieving token, try again",
                color: "error",
              });
              this.isLoading = false;
              return;
            }
            this.$store.dispatch("ui/showSnackbar", {
              label: "Access to your Google Drive account has been authorized",
              color: "success",
            });
            this.driveTokenModel = "";
            this.isLoading = false;
          });
        }, 1212);
        // this.hideDialog();
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
    removeAccess() {
      this.$store.dispatch("ui/toggleDialog", {
        type: "CONFIRMATION_DIALOG",
        val: true,
        data: {
          color: "error",
          title: "Remove Access",
          desc: `Are you sure you want to remove your Google Drive authorization access ?`,
          actions: {
            y: () => {
              this.deleteToken();
            },
          },
        },
      });
      // this.hideDialog()
    },
    deleteToken() {
      this.isLoadingLabel = "Removing access...";
      this.isLoading = true;
      setTimeout(() => {
        this.$store.dispatch("settings/setDriveToken", "");
        this.$store.dispatch("ui/showSnackbar", {
          label:
            "Access to your Google Drive account has been successfully removed",
          color: "success",
        });
        this.isLoading = false;
      }, 1212);
    },
    reauthorize() {
      this.deleteToken();
      this.goToLink();
    },
  },
};
</script>

<style>
</style>
