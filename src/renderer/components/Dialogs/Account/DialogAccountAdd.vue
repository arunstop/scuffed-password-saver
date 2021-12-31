<template>
  <v-dialog
    v-model="accountAddDialog"
    max-width="600"
    scrollable
    :fullscreen="$vuetify.breakpoint.smAndDown"
    transition="slide-y-reverse-transition"
  >
    <v-form
      ref="formAccountAdd"
      v-model="formAccountAdd"
      @submit="accountAdd()"
    >
      <v-card outlined>
        <v-card-title>
          Add New Account
          <UtilDialogCloseBtn :action="() => hideDialog()" />
        </v-card-title>
        <v-card-text class="pt-4">
          <v-combobox
            v-model="appName"
            :items="appList"
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
              <v-list-item-avatar>
                <!-- <UtilProfile :alpha="data.item.name" :color="'primary'" /> -->
                <v-img
                  :style="`background-image:${data.item.iconProcessed};background-size:contain;`"
                  width="100%"
                  height="100%"
                >
                </v-img>
              </v-list-item-avatar>
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
            v-bind="getPwDupWarning"
          />
          <v-combobox
            v-model="accountTags"
            :items="getTagList()"
            multiple
            small-chips
            hide-selected
            :search-input.sync="accTagsSearch"
            placeholder="Tag 1 [enter] Tag 2 [enter]"
            label="Tags"
            outlined
            prepend-icon="mdi-tag"
            clearable
          >
            <template v-if="(accTagsSearch || '').trim() !== ''" #no-data>
              <v-list-item>
                <span class="subtitle-1">Add</span>
                <v-chip class="mx-2 white--text" small label color="indigo">
                  {{ accTagsSearch }}
                </v-chip>
                <span>tag</span>
              </v-list-item>
            </template>
            <template #selection="{ attrs, item }">
              <v-chip
                v-bind="attrs"
                class="white--text"
                close
                small
                label
                color="indigo"
                @click:close="accTagsDeleteItem(item)"
              >
                {{ item }}
              </v-chip>
            </template>
          </v-combobox>
          <v-textarea
            v-model="accountNote"
            :placeholder="noteLabel"
            label="Note (optional)"
            outlined
            prepend-icon="mdi-note-edit-outline"
          />
          <v-card-actions class="d-flex px-0">
            <v-btn
              ref="btnDialogAccountAddN"
              class="flex-grow-1"
              large
              outlined
              tabindex="-1"
              @click.stop="hideDialog()"
            >
              Cancel
            </v-btn>
            <v-btn
              ref="btnDialogAccountAddY"
              class="flex-grow-1"
              large
              color="success"
              :disabled="!formAccountAdd"
              @click.stop="accountAdd()"
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
import { mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    appName: "",
    appNameSearch: "",
    accountId: "",
    accountPw: "",
    accountNote: "",
    accountTags: [],
    accTagsSearch: "",
    noteLabel:
      "Enter important message about this account e.g. PIN, Recovery Number/Email/Phone number, etc)",
    formAccountAdd: false,
  }),
  computed: {
    ...mapGetters("app", ["getAppByName", "getAppList"]),
    ...mapGetters("account", [
      "isAccountExist",
      "countPwDuplicates",
      "getTagList",
    ]),
    ...mapGetters("app", ["getAppIcon"]),
    ...mapState("settings", ["reminderFreq", "pwDuplication"]),
    accountAddDialog: {
      get() {
        return this.$store.getters["ui/isDialogActive"]("ACCOUNT_ADD_DIALOG");
      },
      set(v) {
        this.hideDialog();
      },
    },
    appList() {
      const appIcon = (name) => {
        const themedColor = this.$vuetify.theme.dark ? "grey" : "grey";
        return this.getAppIcon(name).css.replaceAll(
          "currentColor",
          themedColor
        );
      };
      return this.getAppList().map((e) => {
        return { ...e, iconProcessed: appIcon(e.name) };
      });
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
    accountPwRules() {
      return [
        (v) => !!(v || "").trim() || "Password is required!",
        (v) => {
          const cPwDup = this.countPwDuplicates(v || "");
          if (this.pwDuplication && cPwDup.full) {
            return `This password has reached its usage limit ${cPwDup.count}/${cPwDup.limit}`;
          } else if (!this.pwDuplication && cPwDup.count !== 0) {
            return "This exact password already exists";
          }
          return true;
        },
      ];
    },
    appNameSuccess() {
      if (!this.appNameSearch) {
        return null;
      } else {
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
    getPwDupWarning() {
      const pw = this.accountPw;
      const cPwDup = this.countPwDuplicates(pw || "");
      if (!!pw && this.pwDuplication && cPwDup.available) {
        // alert(cPwDup.count)
        return {
          color: "warning",
          messages: `After this action, this exact password usage limit will be ${
            cPwDup.count + 1
          }/${cPwDup.limit}`,
        };
      }
      return null;
    },
  },
  watch: {
    appName(v) {
      if (this.accountId || this.accountPw) {
        this.$refs.formAccountAdd.validate();
        this.accountId = this.accountId + "";
      }
    },
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
    //     this.$refs.btnDialogAccountAddY.$el.click();
    //   }
    // });
  },
  methods: {
    hideDialog() {
      this.$store.dispatch("ui/toggleDialog", {
        type: "ACCOUNT_ADD_DIALOG",
        val: false,
      });
    },
    accTagsDeleteItem(tag) {
      this.accountTags = this.accountTags.filter((e) => e !== tag);
      this.accountTagsSearch = "";
    },
    accountAdd() {
      this.$refs.formAccountAdd.validate();
      if (this.formAccountAdd) {
        // check if app exists and get the value (obj)
        let targetedApp = this.getAppByName(this.appNameSearch);
        if (!targetedApp) {
          // NO = adding the app first
          alert("add first");
          targetedApp = this.appNameSearch;
          this.$store.dispatch("app/addApp", {
            name: targetedApp,
            urls: [],
          });
        } else {
          // YES = changing the app value into found appName value
          targetedApp = targetedApp.name;
        }
        this.$store.dispatch("account/addAccount", {
          appName: targetedApp,
          accountId: this.accountId,
          accountPw: this.accountPw,
          accountTags: require("lodash").compact(this.accountTags),
          accountNote: this.accountNote,
        });
        // this.$store.dispatch("ui/showSnackbar", {
        //   label: this.appName + "has been added",
        //   color: "success",
        // });
        this.$refs.formAccountAdd.reset();
      }
    },
  },
};
</script>

<style>
</style>
