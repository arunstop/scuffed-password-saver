<template>
  <v-card
    class="d-flex align-center justify-center pointer-events-none"
    :min-height="size"
    :min-width="size"
    :color="color"
  >
    <div>
      <div class="d-flex d-flex align-center justify-center">
        <span
          class="util-alpha-u white--text"
          :style="`font-size:${size * 60 / 100}px`"
        >
          {{ alpha.charAt(0).toUpperCase() }}
        </span>
        <span
          class="util-alpha-l white--text"
          :style="`font-size:${size * 45 / 100}px`"
        >
          {{ alpha.charAt(1).toLowerCase() }}
        </span>
      </div>
      <div
        class="util-alpha-stripe mx-auto"
        :style="`width:${size * 30 / 100}px; height:${size * 5 / 100}px;`"
      />
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    alpha: { type: String, default: "A" },
    color: { type: String, default: "grey" },
    size: { type: Number, default: 40 },
  },
  // mounted(){
  //   console.log(`font-size:${this.size*60/100}px`)
  //   console.log(`font-size:${this.size*45/100}px`)
  // }
};
</script>

<style>
.util-alpha-stripe {
  /* height:2px; */
  /* width:12px; */
  background-color: white;
}

.util-alpha-u {
  font-weight: bold;
  /* font-size: 24px; */
  line-height: 100% !important;
  margin-right: 1px;
}
.util-alpha-l {
  font-weight: bold;
  /* font-size: 18px; */
}
</style>
