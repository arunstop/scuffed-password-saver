<template>
  <div>
    <div class="d-flex">
      <v-btn class="me-4" color="success">
        <v-icon left>mdi-lock</v-icon>
        Save New Account
      </v-btn>
      <v-btn class="me-4" color="primary" @click.stop="openAddAppDialog()">
        <v-icon left>mdi-plus</v-icon>
        Add New Application
      </v-btn>
    </div>
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
      apps:{}
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
    openAddAppDialog(){
        this.$store.dispatch('ui/toggleAddAppDialog', true)
    }
  },
};
</script>

<style>
</style>
