<template>
  <div>
    <div class="d-flex flex-wrap">
      <v-btn class="me-4 mt-4" color="success" @click.stop="openAccountAddDialog()">
        <v-icon left>mdi-lock</v-icon>
        Save New Account
      </v-btn>
      <v-btn class="me-4 mt-4" color="primary" @click.stop="openAppAddDialog()">
        <v-icon left>mdi-plus</v-icon>
        Add New Application
      </v-btn>
      <AppList class="me-4 mt-4" />
    </div>

    <!-- <v-btn @click.stop="snack()"> snack </v-btn> -->
    <AccountList />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
// import SystemInformation from "@/components/SystemInformation.vue";

export default {
  components: {},
  data () {
    return {
      externalContent: '',
      drawerAttrs: {},
      apps: {}
    }
  },
  methods: {
    ...mapActions('ui', ['toggleDialog']),
    // snack() {
    //   this.$store.dispatch("ui/showSnackbar", {
    //     label: "snack",
    //     color: "success",
    //   });
    // },
    openAppAddDialog () {
      this.toggleDialog({ type: 'APP_ADD_DIALOG', val: true })
    },
    openAppEditDialog (name) {
      this.toggleDialog({ type: 'APP_EDIT_DIALOG', val: true, name })
    },
    openAccountAddDialog () {
      this.toggleDialog({ type: 'ACCOUNT_ADD_DIALOG', val: true })
    },
    deleteApp (name) {
      this.$store.dispatch('app/deleteApp', name)
    }
  }
}
</script>

<style>
</style>
