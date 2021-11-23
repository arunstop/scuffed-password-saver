<template>
  <div>
    <v-list-item class="">
      <v-list-item-content>
        <v-list-item-title class="font-weight-black normal-white-space text-h5">
          <v-icon class="primary--text mb-1"> mdi-upload-multiple </v-icon>
          Export accounts
        </v-list-item-title>
        <v-list-item-subtitle class="text-break normal-white-space subtitle-2">
          Export all of your accounts into number of file formats.
        </v-list-item-subtitle>
      </v-list-item-content>
      <div class="ms-2" style="max-width: 180px">
        <v-dialog v-model="dialog" max-width="420px">
          <template #activator="{ on, attrs }">
            <v-btn
              class="ms-2"
              max-width="240"
              large
              color="primary"
              style="text-overflow: ellipsis !important"
              v-bind="attrs"
              v-on="on"
            >
              Export
            </v-btn>
          </template>
          <v-card outlined>
            <v-card-title class="primary--text">
              Choose file format
            </v-card-title>
            <v-form
              ref="formExportAccs"
              v-model="formExportAccs"
              @submit.prevent="exportAccs()"
            >
              <v-card-text class="pb-0">
                <v-select
                  v-model="fileFormatModel"
                  :items="fileFormatItems"
                  prepend-icon="mdi-file"
                  :rules="[(v) => !!v || 'Please choose file format']"
                  outlined
                  label="Choose File Format"
                />
              </v-card-text>
            </v-form>
            <v-card-actions class="px-6 pb-6">
              <v-spacer />
              <v-btn ref="btnDialogPdlN" outlined @click="toggleDialog()">
                Cancel
              </v-btn>
              <v-btn
                ref="btnDialogPdlY"
                :disabled="!formExportAccs"
                color="primary"
                @click="exportAccs()"
              >
                EXPORT
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      fileFormatModel: '',
      formExportAccs: false
    }
  },
  computed: {
    ...mapState('settings', ['reminderFreq', 'vaultPath']),
    reminderFreqModel: {
      get () {
        const v = this.reminderFreq
        return v + (v * 1 === 1 ? ' month' : ' months')
      },
      set (v) {
        this.$store.dispatch('settings/setReminderFreq', v)
      }
    },
    fileFormatItems () {
      const ff = ['.JSON', '.TXT', '.CSV']
      return ff
    }
  },
  methods: {
    toggleDialog () {
      this.dialog = !this.dialog
    },
    exportAccs () {
      this.$refs.formExportAccs.validate()
      if (this.formExportAccs) {
        const accList = JSON.stringify(this.$store.state.account.accountList)
        const ext = this.fileFormatModel.toLowerCase()

        const url = () => {
          if (ext === '.json') {
            return (
              'data:text/json;charset=utf-8,' + encodeURIComponent(accList)
            )
          } else if (ext === '.txt') {
            return (
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(
                this.$globals.jsonToTxt(this.$store.state.account.accountList)
              )
            )
          } else if (ext === '.csv') {
            return (
              'data:text/csv;charset=utf-8,' +
              encodeURIComponent(
                this.$globals.jsonToCsv(this.$store.state.account.accountList)
              )
            )
          }
        }

        const filename = () => {
          return `sps_backup_${this.$date
            .moment()
            .format('YYYY-MM-DD@HH-mm-ss')}${ext}`
        }

        this.$globals.download({
          url: url(),
          filename: filename(),
          directory: this.vaultPath,
          successAction: (path) => {
            this.$store.dispatch('ui/showSnackbar', {
              label: 'Exported to vault successfully',
              color: 'success'
            })
          }
        })

        this.toggleDialog()
      }
    }
  }
}
</script>

<style>
</style>
