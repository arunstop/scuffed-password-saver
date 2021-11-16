<template>
  <v-list-item link>
    <v-list-item-content>
      <v-list-item-icon>
        <v-icon>mdi-apps</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>
        {{ account.appName }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-title>
      <v-icon small>mdi-at</v-icon>
      {{ account.accountId }}
    </v-list-item-title>
    <v-list-item-title>
      <v-icon small>mdi-key-variant</v-icon>
      {{ account.accountPw }}
    </v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  props: {
    account: { type: Object, default: () => {} }
  }
}
</script>

<style>
</style>
