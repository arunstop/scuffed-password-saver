<template>
  <v-dialog v-model="accountEditDialog" max-width="480">
    <v-form
      ref="formAccountEdit"
      v-model="formAccountEdit"
      @submit="accountEdit()"
    >
      <v-card outlined>
        <v-card-title>Edit Account {{ appName.name }}</v-card-title>
        <v-card-text class="">
          <v-alert
            :type="pwDurab.status"
            dense
            text
            border="left"
            icon="mdi-clock"
          >
            Password Durability :
            <span class="sps-text-highlight"> {{ pwDurab.percentage }}% </span>
            <br />
            <span class="sps-text-highlight">{{
              pwDurab.daysLeft + " days left"
            }}</span>
            {{ " to change this password" }}
            <br />
            {{ "On " + pwDurab.dueDate + "" }}
          </v-alert>
          <v-alert type="info" dense text border="left" icon="mdi-plus-circle">
            Created
            <span class="sps-text-highlight">
              {{ dates.created.fromNow }}
            </span>
            <br />
            {{ "On " + dates.created.fullDate + "" }}
          </v-alert>
          <v-alert type="info" dense text border="left" icon="mdi-pencil">
            Edited
            <u
              ><b>{{ dates.edited.fromNow }}</b></u
            >
            <br />
            {{ "On " + dates.edited.fullDate + "" }}
          </v-alert>
          <v-combobox
            v-model="appName"
            :items="getAppList()"
            :rules="appNameRules"
            :search-input.sync="appNameSearch"
            item-text="name"
            return-object
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
            autofocus
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
              :disabled="isUnchanged()"
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
    ...mapGetters("account", [
      "isAccountExist",
      "isPwExist",
      "countPwDuplicates",
    ]),
    ...mapState("account", ["accountEditValue"]),
    ...mapState("settings", ["reminderFreq", "pwDuplication"]),
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
          v === this.accountEditValue.accountId ||
          "This ID already exists",
      ];
    },
    accountPwRules() {
      return [
        (v) => !!(v || "").trim() || "Password is required!",
        (v) => {
          const cPwDup = this.countPwDuplicates(v || "");
          if (v !== this.accountEditValue.accountPw) {
            if (this.pwDuplication && cPwDup.full) {
              return `This password has reached its usage limit ${cPwDup.count}/${cPwDup.limit}`;
            }
          }
          return true
        },
      ];
    },
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
    dates() {
      const created = this.$date.moment(this.accountEditValue.created);
      const edited = this.$date.moment(this.accountEditValue.edited);
      return {
        created: {
          fromNow: created.fromNow(),
          fullDate: created.format("dddd, DD MMMM YYYY [at] HH:mm"),
        },
        edited: {
          fromNow: edited.fromNow(),
          fullDate: edited.format("dddd, DD MMMM YYYY [at] HH:mm"),
        },
      };
    },
    pwDurab() {
      const editedPw = this.accountEditValue.editedPw;
      const now = this.$date.moment();
      const edited = this.$date.moment(editedPw);
      const dueDate = this.$date
        .moment(editedPw)
        .add(this.reminderFreq, "months");
      const daysFull = dueDate.diff(edited, "days") - 1;
      const daysLeft = dueDate.diff(now, "days");
      const percentage = () => {
        if (daysLeft < 0) {
          return 0;
        }
        return Math.round((daysLeft / daysFull) * 100) || 0;
      };
      const status = (v) => {
        if (v >= 70) {
          return "success";
        } else if (v >= 40) {
          return "warning";
        } else {
          return "error";
        }
      };
      return {
        dueDate: dueDate.format("dddd, DD MMMM YYYY [at] HH:mm"),
        daysLeft,
        percentage: percentage(),
        status: status(percentage()),
      };
    },
    getPwDupWarning() {
      const pw = this.accountPw
      const cPwDup = this.countPwDuplicates( pw || "");
      if (pw!==this.accountEditValue.accountPw && this.pwDuplication && cPwDup.available) {
        // alert(cPwDup.count)
        return {
          color: 'warning',
          messages: `After this action, this exact password usage limit will be ${cPwDup.count+1}/${cPwDup.limit}`,
        };
      }
      return null;
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
    this.appName =
      this.getAppByName(this.accountEditValue.appName) ||
      this.accountEditValue.appName;
    this.appNameSearch = this.appName?.name || this.appName;
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
    isUnchanged() {
      if (
        this.appName === this.getAppByName(this.accountEditValue.appName) &&
        this.accountId === this.accountEditValue.accountId &&
        this.accountPw === this.accountEditValue.accountPw &&
        this.accountNote === this.accountEditValue.accountNote
      ) {
        return true;
      }
      return false;
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
          id: this.accountEditValue.id,
          appName: this.appName.name || this.appName,
          accountId: this.accountId,
          accountPw: this.accountPw,
          accountNote: this.accountNote,
        });
        // this.$store.dispatch("ui/showSnackbar", {
        //   label: this.appName + "has been added",
        //   color: "success",
        // });
        this.$refs.formAccountEdit.reset();
        this.hideDialog();
      }
    },
  },
};
</script>

<style>
.sps-text-highlight {
  text-decoration: underline;
  font-weight: bold;
}
</style>