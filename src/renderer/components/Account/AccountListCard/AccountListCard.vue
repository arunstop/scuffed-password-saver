<template>
  <div
    class="fill-height d-flex justify-center"
    style="position: relative; min-height: 100vh"
  >
    <v-scale-transition
      class="row no-gutters justify-center flex-wrap"
      style="min-width: 100%; height:min-content;"
      group
      origin="center center"
      hide-on-leave
    >
      <AccountListCardItem v-for="acc in data" :key="acc.id" :acc="acc" />
    </v-scale-transition>

    <div
      v-if="!data.length"
      class="d-flex"
      style="min-height: 300px; position: absolute"
    >
      <v-card class="ma-auto" elevation="0">
        <v-card-text v-if="$store.state.account.accountList.length" class="d-flex flex-column text-center">
          <v-icon size="90">mdi-robot-confused</v-icon>
          <h3 class="font-weight-bold">No matches were found.</h3>
          <v-btn
            class="mt-4 font-weight-bold"
            outlined
            color="error"
            @click="resetSearch()"
          >
            Reset search
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text v-else class="d-flex flex-column text-center">
          <v-icon size="90">mdi-robot-confused</v-icon>
          <h3 class="font-weight-bold">You account list is currently empty.</h3>
          <v-btn
            class="mt-4 font-weight-bold"
            outlined
            color="primary"
            @click="openAccountAddDialog()"
          >
            Add Account
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  props: {
    data: { type: Array, default: () => [] }
  },
  computed: {
    sortedList () {
      return this.data
    }
  },
  methods: {
    ...mapActions('ui', ['toggleDialog']),
    resetSearch () {
      this.$store.dispatch('account/setAccountSearch', '')
    },
   openAccountAddDialog () {
      this.toggleDialog({ type: 'ACCOUNT_ADD_DIALOG', val: true })
    },
  }
}
</script>

<style>
</style>
