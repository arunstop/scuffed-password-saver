<template>
  <v-dialog v-model="accountEditDialog" max-width="480">
    <v-form
      ref="formAccountEdit"
      v-model="formAccountEdit"
      @submit="accountEdit()"
    >
      <v-card>
        <v-card-title>Edit Account</v-card-title>
        <v-card-text class="mt-4">
          <v-combobox
            v-model="appName"
            :items="getAppList()"
            :rules="appNameRules"
            :search-input.sync="appNameSearch"
            item-text="name"
            item-value="name"
            placeholder="Choose app/website or add a new one"
            label="Choose app"
            :success-messages="appNameSuccess"
            outlined
            prepend-icon="mdi-alphabetical-variant"
          >
            <template #item="data">
              <v-list-item-icon>
                <v-icon>mdi-apps</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ data.item.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ data.item.urls.toString().replaceAll(",", " | ") }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-combobox>
          <v-text-field
            v-model="accountId"
            :rules="accountIdRules"
            placeholder="Enter ID / Username / Email / Phone number"
            label="ID / Username / Email / Phone number"
            outlined
            prepend-icon="mdi-at"
          />
          <v-text-field
            v-model="accountPw"
            :rules="accountPwRules"
            placeholder="Enter Password/PIN or any other keyword"
            label="Password"
            outlined
            prepend-icon="mdi-key-variant"
          />
          <v-textarea
            v-model="accountNote"
            :placeholder="noteLabel"
            label="Note (optional)"
            outlined
            prepend-icon="mdi-note-edit-outline"
          />
          <v-card-actions class="d-flex px-0">
            <v-btn
              ref="btnDialogAccountEditN"
              class="flex-grow-1"
              large
              outlined
              tabindex="-1"
              @click.stop="hideDialog()"
            >
              Cancel
            </v-btn>
            <v-btn
              ref="btnDialogAccountEditY"
              class="flex-grow-1"
              large
              color="success"
              @click.stop="accountEdit()"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data: () => ({
    appName: "",
    appNameSearch: "",
    accountId: "",
    accountPw: "",
    accountNote: "",
    noteLabel:
      "Enter important message about this account e.g. PIN, Recovery Number/Email/Phone number, etc)",
    formAccountEdit: false,
  }),
  computed: {
    ...mapGetters("app", ["getAppByName", "getAppList"]),
    ...mapGetters("account", ["isAccountExist"]),
    ...mapState("account", ["accountEditValue"]),
    accountEditDialog: {
      get() {
        return this.$store.state.ui.accountEditDialog;
      },
      set(v) {
        this.$store.dispatch("ui/toggleAccountEditDialog", v);
      },
    },
    appNameRules: () => [
      // IF appName is falsey (null,0,undefined) then it's error
      (v) => !!v || "Please choose an app/website!",
      // IF getAppByName() has value, then it's error
      //   (v) =>
      //     !this.getAppByName((v || "").trim()) || "Application already exists!",
    ],
    accountIdRules() {
      return [
        (v) =>
          !!(v || "").trim() ||
          "ID / Username / Email / Phone number is required!",
        (v) =>
          !this.isAccountExist(this.appName?.name || "", (v || "").trim()) ||
          "This ID already exists",
      ];
    },
    accountPwRules: () => [
      (v) => !!(v || "").trim() || "Password is required!",
    ],
    appNameSuccess() {
      if (!this.appNameSearch) return null;
      else {
        const selectedApp = this.getAppByName(this.appNameSearch);
        const successMsgUrlNotNull = this.$globals.lodash.isEmpty(
          selectedApp?.urls
        )
          ? ""
          : ", this account will work on : " +
            selectedApp?.urls.toString().replaceAll(",", " | ");
        return !selectedApp
          ? "Application : " + this.appNameSearch + " will be created"
          : this.appNameSearch + " is selected" + successMsgUrlNotNull;
      }
    },
  },
  watch: {
    appName(v) {
      if (this.accountId || this.accountPw) {
        this.$refs.formAccountEdit.validate();
        this.accountId = this.accountId + "";
      }
    },
  },
  created() {
    this.appName = this.accountEditValue.appName;
    this.appNameSearch = this.accountEditValue.appName.name;
    this.accountId = this.accountEditValue.accountId;
    this.accountPw = this.accountEditValue.accountPw;
    this.accountNote = this.accountEditValue.accountNote;
  },
  mounted() {
    // console.log(this.getAppList());
    // window.addEventListener("keyup", (e) => {
    //   if (
    //     e.key === "Enter" ||
    //     e.key === " " ||
    //     e.key === "Spacebar" ||
    //     e.key === "Space bar"
    //   ) {
    //     this.$refs.btnDialogAccountEditY.$el.click();
    //   }
    // });
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleAccountEditDialog", false);
    },
    accountEdit() {
      this.$refs.formAccountEdit.validate();
      if (this.formAccountEdit) {
        const app = this.appName.name || this.appName;
        if (!this.getAppByName(app)) {
          this.$store.dispatch("app/addApp", {
            name: app,
            urls: [],
          });
        }
        this.$store.dispatch("account/editAccount", {
          appName: this.appName.name,
          accountId: this.accountId,
          accountPw: this.accountPw,
          accountNote: this.accountNote,
        });
        // this.$store.dispatch("ui/showSnackbar", {
        //   label: this.appName + "has been added",
        //   color: "success",
        // });
        this.$refs.formAccountEdit.reset();
      }
    },
  },
};
</script>

<style>
</style>