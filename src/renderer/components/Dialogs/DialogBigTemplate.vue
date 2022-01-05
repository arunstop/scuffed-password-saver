<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    scrollable
    :fullscreen="$vuetify.breakpoint.smAndDown"
    transition="slide-y-reverse-transition"
  >
    <v-card outlined>
      <v-card-title>
        {{ title }}
        <UtilDialogCloseBtn :action="() => hideDialog()" />
      </v-card-title>
      <v-card-text class="pt-4">
        <slot name="body" />
        <v-card-actions v-if="!noAction" class="d-flex px-0">
          <v-btn
            ref="btnDialogAccountAddN"
            class="flex-grow-1"
            large
            outlined
            tabindex="-1"
            @click.stop="hideDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            ref="btnDialogAccountAddY"
            class="flex-grow-1"
            large
            color="success"
            @click.stop="actionY()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    type: { type: String, default: () => {} },
    title: { type: String, default: () => {} },
    actionN: { type: Function, default: () => {} },
    actionY: { type: Function, default: () => {} },
    noAction: Boolean
  },
  computed: {
    dialog: {
      get () {
        return this.$store.getters['ui/isDialogActive'](this.type)
      },
      set () {
        this.hideDialog()
      }
    }
  },
  methods: {
    hideDialog () {
      this.actionN()
      this.$store.dispatch('ui/toggleDialog', {
        type: this.type,
        val: false
      })
    }
  }
}
</script>

<style>
</style>
