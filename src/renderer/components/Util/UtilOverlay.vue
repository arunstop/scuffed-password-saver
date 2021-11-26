<template>
  <v-scale-transition origin="center center">
      <v-overlay v-if="show" :opacity="$vuetify.theme.dark ? 0.9 :0.46">
    <v-card class="text-center pa-4 rounded-lg" color="orange" outlined>
      <v-progress-circular
        color="white"
        :size="96"
        indeterminate
        :width="12"
      />
      <div class="mt-4 font-weight-medium text-h5">{{label}}</div>
    </v-card>
  </v-overlay>
  </v-scale-transition>
</template>

<script>
export default {
    props:{
        label: {type:String, default:()=>''},
        show: Boolean,
    }
};
</script>

<style>
</style>