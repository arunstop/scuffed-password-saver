<template>
  <v-chip
    class="mx-1 my-2 font-weight-bold"
    :class="isSearched ? 'white--text' : ''"
    color="indigo ligthen-2"
    label
    :outlined="!isSearched"
    @click="searchAppByName()"
  >
    {{ app.name }}
    {{ ` - ${app.count}` }}
  </v-chip>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  props: {
    app: { type: Object, default: () => {} },
  },
  computed: {
    ...mapState("account", ["filterByAppList"]),
    isSearched() {
      return (
        this.filterByAppList.includes(this.app.name.toLowerCase().trim())
      );
    },
  },
  methods: {
    searchAppByName() {
      if (this.isSearched) {
        this.$store.dispatch("account/removeFilterByApp", this.app.name);
      } else {
        this.$store.dispatch("account/addFilterByApp", this.app.name);
      }
    },
  },
};
</script>

<style>
</style>