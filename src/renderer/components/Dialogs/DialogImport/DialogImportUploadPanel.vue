<template>
  <div class="my-auto">
    <v-card
      v-if="!fileAccountList.length"
      v-bind="importPanel.loading"
      outlined
      height="300"
      class="upload-panel"
      :color="importPanel.color"
      @click="uploadFiles()"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <div class="d-flex align-center justify-center fill-height">
        <div class="text-center" v-bind="importPanel.buttonAttrs" >
          <v-btn color="primary" v-bind="importPanel.buttonAttrs" large>
            UPLOAD
            <v-icon>mdi-upload</v-icon>
          </v-btn>

          <h4 class="mt-4" :class="importPanel.textColor">Click the button above or drag Files here.</h4>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      importPanel: { color: '',textColor: '', buttonAttrs: {
        outlined:true
      }, loading: {} }
    }
  },
  computed: {
    fileAccountList: {
      get () {
        return this.$store.state.ui.dialogImport.fileAccountList
      },
      set (v) {
        this.$store.dispatch('ui/dialogImport/setFileAccountList', v)
      }
    }
  },
  methods: {
    uploadFiles () {
      //   this.$refs.importFileInput.$refs.input.click();
      this.$nuxt.$emit('clickImportFileInput')
    },
    dragover (event) {
      event.preventDefault()
      this.toggleImportPanel(true)
    },
    dragleave (event) {
      event.preventDefault()
      this.toggleImportPanel(false)
    },
    async drop (event) {
      event.preventDefault()
      this.toggleImportPanelLoading(true)
      const fileList = Array.from(event.dataTransfer.files)
      const extList = this.$store.state.account.extList
      const validFiles = fileList.filter(e =>
        extList.includes(e.name.toLowerCase().trim().split('.').reverse()[0])
      )

      this.fileAccountList = validFiles
      this.toggleImportPanelLoading(false)
      this.toggleImportPanel(false)
    },
    toggleImportPanelLoading (v) {
      if (v) {
        this.importPanel.loading = { loading: true, disabled: true }
      }
      this.importPanel.loading = {}
    },
    toggleImportPanel (v) {
      if (v) {
        this.importPanel.color = 'indigo' 
        this.importPanel.textColor = 'white--text'
        this.importPanel.buttonAttrs = {
          class : 'pointer-events-none',
          outlined : false,
        }
        // return
      }
      this.importPanel.color = ''
      this.importPanel.textColor = ''
      this.importPanel.buttonAttrs = {
        outlined:false
      }
    }
  }
}
</script>

<style>
.upload-panel {
  border: 2px dashed !important;
}
</style>
