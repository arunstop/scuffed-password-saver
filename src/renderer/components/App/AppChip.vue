<template>
  <v-chip
    class="mx-1 my-2"
    color="primary lighten-2"
    :outlined="!isSearched"
    @click="searchAppByName()"
  >
    {{ app.name }}
    {{ ` - ${appCount}` }}
  </v-chip>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  props: {
    app: { type: Object, default: () => {} },
  },
  computed: {
    ...mapGetters("account", ["countAccountByApp"]),
    ...mapState("account", ["accountSearch"]),
    appCount() {
      return this.countAccountByApp(this.app.name);
    },
    isSearched() {
      return (
        this.accountSearch.toLowerCase().trim() ===
        this.app.name.toLowerCase().trim()
      );
    },
  },
  methods: {
    searchAppByName() {
      if (this.isSearched) {
        this.$store.dispatch("account/setAccountSearch", "");
      } else {
        this.$store.dispatch("account/setAccountSearch", this.app.name);
      }
    },
  },
};
</script>

<style>
</style>