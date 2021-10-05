<template>
  <div>
    <div class="d-flex">
      <v-btn class="me-4" color="success">
        <v-icon left>mdi-lock</v-icon>
        Save New Account
      </v-btn>
      <v-btn class="me-4" color="primary" @click.stop="openAppAddDialog()">
        <v-icon left>mdi-plus</v-icon>
        Add New Application
      </v-btn>
    </div>
    <v-btn
      v-for="a in $store.state.app.appList"
      :key="a.name"
      @click="openAppEditDialog(a.name)"
    >
      {{ a.name }}
    </v-btn>
    <v-btn @click.stop="snack()"> snack </v-btn>
    <v-btn @click="doNavigate()"> settings </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { remote } from "electron";
// import SystemInformation from "@/components/SystemInformation.vue";

export default {
  components: {},
  data() {
    return {
      externalContent: "",
      drawerAttrs: {},
      apps: {},
    };
  },
  methods: {
    snack() {
      this.$store.dispatch("ui/addSnackbar", {
        label: "snack",
        color: "success",
      });
    },
    doNavigate() {
      this.$router.push({ name: "settings" });
    },
    openAppAddDialog() {
      this.$store.dispatch("ui/toggleAppAddDialog", true);
    },
    openAppEditDialog(name) {
      this.$store.dispatch("ui/toggleAppEditDialog", { val: true, name });
    },
  },
};
</script>

<style>
</style>
