<template>
  <v-dialog v-model="initFolderDialog" max-width="600px" transition="slide-y-reverse-transition">
    <v-card outlined>
      <v-card-title class="text-break text-center">
        Where do you want to save your passwords?
      </v-card-title>
      <v-card-text class="mt-4">
        <v-text-field v-model="path" hide-details="" solo outlined>
          <template #append>
            <v-btn color="primary" @click.stop="execChooseFolder()">
              Select Folder
              <v-icon right>mdi-folder-open</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-actions class="px-6 pb-6">
        <v-btn
          color="primary"
          block
          large
          :disabled="!isValidPath()"
          @click="execSetPath()"
        >
          Yep, save them right there!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { remote } from "electron";
export default {
  data() {
    return { path: "" };
  },
  computed: {
    ...mapState("settings", ["vaultPath"]),
    initFolderDialog: {
      get() {
        return this.$store.getters["ui/isDialogActive"]("INIT_FOLDER_DIALOG");
      },
      set(v) {
        this.$store.dispatch("ui/toggleDialog", {
          type: "INIT_FOLDER_DIALOG",
          val: v,
        });
      },
    },
  },
  created() {
    this.path = this.vaultPath;
    // if(this.vaultPath){
    //   this.execChooseFolder()
    // }
  },
  methods: {
    async execChooseFolder() {
      const choosenPath = await remote.dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      this.path = choosenPath.filePaths[0] || this.path;
    },
    execSetPath() {
      if (this.path.includes(":\\")) {
        this.$store.dispatch("settings/setVaultPath", this.path);
        const snackbar = {
          label: "Vault folder is set! But, shhh! Don't tell anyone ;)",
          color: "success",
        };
        this.$store.dispatch("ui/showSnackbar", snackbar, { root: true });
      }
    },
    isValidPath() {
      if (this.path === this.vaultPath) {
        return false;
      } else if (this.path.includes(":\\")) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
</style>
