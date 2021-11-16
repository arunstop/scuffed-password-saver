<template>
  <v-chip
    v-if="countAccountByApp(app.name)"
    class="mx-1 my-2 font-weight-bold"
    :class="isSearched ? 'white--text' : ''"
    :color="color"
    label
    :outlined="!isSearched"
    @click="searchAppByName()"
  >
    <v-icon v-if="!isListed" left small>
      {{ isSearched ? "mdi-alert-circle-outline" : "mdi-alert-circle" }}
    </v-icon>
    {{ app.name }}
    {{ ` - ${countAccountByApp(app.name)}` }}
  </v-chip>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    app: { type: Object, default: () => {} }
  },
  computed: {
    ...mapState('account', ['filterByAppList']),
    ...mapGetters('account', ['countAccountByApp']),
    ...mapGetters('app', ['getAppByName']),
    isSearched () {
      return this.filterByAppList.includes(this.app.name.toLowerCase().trim())
    },
    isListed () {
      return !!this.getAppByName(this.app.name)
    },
    color () {
      return this.isListed ? 'indigo ligthen-2' : 'warning'
    }
  },
  methods: {
    searchAppByName () {
      if (this.isSearched) {
        this.$store.dispatch('account/removeFilterByApp', this.app.name)
      } else {
        this.$store.dispatch('account/addFilterByApp', this.app.name)
      }
    }
  }
}
</script>

<style>
</style>
