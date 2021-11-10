<template>
  <v-card
    class="d-flex align-center justify-center"
    min-height="40"
    min-width="40"
    :color="color"
  >
    <div>
      <div class="d-flex d-flex align-center justify-center">
        <span class="util-alpha-u white--text">
          {{ alpha.charAt(0).toUpperCase() }}
        </span>
        <span class="util-alpha-l white--text">
          {{ alpha.charAt(1).toLowerCase() }}
        </span>
      </div>
      <div class="util-alpha-stripe mx-auto"/>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    alpha: { type: String, default: "A" },
    color: { type: String, default: "grey" },
  },
};
</script>

<style>
.util-alpha-stripe{
  height:2px;
  width:12px;
  background-color: white;
}

.util-alpha-u {
  font-weight: bold;
  font-size: 24px;
  line-height: 100% !important;
  margin-right:1px;
}
.util-alpha-l {
  font-weight: bold;
  font-size: 18px;
}
</style>