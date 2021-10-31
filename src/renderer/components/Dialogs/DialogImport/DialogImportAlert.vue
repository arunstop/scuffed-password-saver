<template>
  <v-alert
    :type="type"
    :icon="icon"
    text
    border="left"
  >
    <span v-html="message"/>
  </v-alert>
</template>

<script>
export default {
  props: {
    message: { type: String, default: () => '' },
    icon: {type:String,default:()=>''},
    type:{type:String,default:()=>''}
  },
};
</script>

<style>
</style>