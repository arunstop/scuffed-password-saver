<template>
  <div>
    <v-list-item class="" :disabled="!pwDuplicationModel">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="mb-1" :class="!pwDuplicationModel || 'primary--text'">
            mdi-counter
          </v-icon>
          Password Duplication Limit :
          {{
            pwDuplicationModel
              ? pwDupLimit + (pwDupLimit * 1 === 0 ? " (No limit)" : "")
              : "disabled"
          }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          If password duplication is enabled. You may limit how many times the
          same exact passwords can be used.
        </v-list-item-subtitle>
      </v-list-item-content>

      <div style="max-width: 180px">
        <v-dialog v-model="pwDuplicationDialog" max-width="420px">
          <template #activator="{ on, attrs }">
            <v-btn
              class="ms-2"
              max-width="240"
              large
              color="primary"
              style="text-overflow: ellipsis !important"
              v-bind="attrs"
              :disabled="!pwDuplicationModel"
              v-on="on"
            >
              change
            </v-btn>
          </template>
          <v-card outlined>
            <v-card-title class="primary--text">
              Password Duplication Limit
            </v-card-title>
            <v-form
              ref="formSetPwDupLimit"
              v-model="formSetPwDupLimit"
              @submit="setPwDupLimit()"
            >
              <v-card-text class="pb-0">
                <v-alert type="info" dense text>
                  Set value to <b>0</b> to make it unlimited
                </v-alert>
                <v-text-field
                  v-model="pwDupLimitModel"
                  :rules="pwDupLimitRules"
                  class="mt-4 mb-0"
                  autofocus
                  type="number"
                  outlined
                  single-line
                  min="0"
                />
              </v-card-text>
            </v-form>
            <v-card-actions class="px-6 pb-6">
              <v-spacer />
              <v-btn
                ref="btnDialogPdlN"
                outlined
                @click="togglePwDupLimitDialog()"
              >
                Cancel
              </v-btn>
              <v-btn
                ref="btnDialogPdlY"
                color="primary"
                @click="setPwDupLimit()"
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
      pwDuplicationDialog: false,
      pwDupLimitModel: 0,
      formSetPwDupLimit: false,
    };
  },
  computed: {
    ...mapState("settings", [
      "pwDuplication",
      "pwDupLimit",
    ]),
    pwDuplicationModel: {
      get() {
        return this.pwDuplication;
      },
      set(v) {
        this.$store.dispatch("settings/togglePwDuplication", v);
      },
    },
    pwDupLimitRules: () => [
      (v) => !!v || "This field is required",
      (v) => v * 1 >= 0 || "Limit cannot be less than 0",
      (v) => /^\d+$/.test(v) || "This field only accept numbers",
    ],
  },
  created() {
    this.pwDupLimitModel = this.pwDupLimit;
  },
  methods: {
    togglePwDupLimitDialog() {
      this.pwDuplicationDialog = !this.pwDuplicationDialog;
    },
    setPwDupLimit() {
      this.$refs.formSetPwDupLimit.validate();
      if (this.formSetPwDupLimit) {
        this.$store.dispatch(
          "settings/setPwDupLimit",
          this.pwDupLimitModel * 1
        );
        this.togglePwDupLimitDialog();
        this.pwDupLimitModel = this.pwDupLimitModel * 1;
      }
    },
  },
};
</script>

<style>
</style>