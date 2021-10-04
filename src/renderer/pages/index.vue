<template>
  <div>
    <SystemInformation />
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
    };
  },
  methods: {
    snack() {
      this.$store.dispatch("ui/addSnackbar", {
        label: "snack",
        color: "success",
      });
    },
    doNavigate(){
      this.$router.push({name:'settings'})
    }
  },
};
</script>

<style>

</style>
