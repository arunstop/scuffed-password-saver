
<template>
  <!-- <v-snackbar v-model="show" :timeout="timeout" :style="calculatePosition()">
    {{ snackbar.id }}

    <template #action="{ attrs }">
      <v-btn color="blue" text v-bind="attrs" @click="removeSnackbar()">
        Close
      </v-btn>
    </template>
  </v-snackbar> -->

  <v-card
    v-if="show"
    class="ma-2 pointer-events rounded-lg"
    :dark="!$vuetify.theme.dark"
    :color="snackbar.color"
    max-height="60px"
    min-width="320px"
    @mouseenter="timer.pause()"
    @mouseleave="timer.resume()"
  >
    <div class="d-flex align-center pa-2 font-weight-regular">
      <span class="ms-4" v-html="snackbar.label"></span>
      <v-spacer />  
      <v-btn class="ms-4" color="white" outlined @click="removeSnackbar()">
        Close
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    snackbar: { type: Object, default: () => {} }
  },
  data: () => ({
    // snackbar: false
    // timeout: 20000,
    hover: false
  }),
  computed: {
    ...mapGetters('ui', ['getSnackbarById']),
    show: {
      get () {
        return this.getSnackbarById(this.snackbar.id)
      },
      set () {
        this.$store.dispatch('ui/removeSnackbar', this.snackbar.id)
      }
    },
    timer () {
      return this.timerInstance()
    }
  },
  created () {
    this.timer.resume()
  },
  methods: {
    timerInstance () {
      class Timer {
        constructor (action, delay) {
          let timerId = delay
          let start = delay
          let remaining = delay

          this.pause = () => {
            // alert('paused')
            window.clearTimeout(timerId)
            remaining -= Date.now() - start
          }
          this.resume = () => {
            start = Date.now()
            window.clearTimeout(timerId)
            timerId = window.setTimeout(action, remaining)
          }
          this.resume()
        }
      }

      return new Timer(() => {
        this.removeSnackbar()
      }, 43433)
    },
    removeSnackbar () {
      // alert(123);
      this.$store.dispatch('ui/removeSnackbar', this.snackbar.id)
    },
    calculatePosition () {
      if (this.snackbar.id !== 1) { return 'margin-bottom: ' + this.snackbar.id * 48 + 'px' }
      return ''
    }
  }
}
</script>

<style>
.pointer-events {
  pointer-events: all;
}
</style>
