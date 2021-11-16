<template>
  <v-card class="mb-4 upload-panel" outlined>
    <v-card
      class="my-4 overflow-y-scroll elevation-0"
      color="transparent"
      max-height="300"
    >
      <v-fade-transition
        class="d-flex ps-4 justify-space-between flex-wrap"
        group
      >
        <v-chip
          v-for="(file, index) in fileAccountList"
          :key="file.name"
          class="ma-2 py-2 white--text"
          color="indigo"
          label
          close
          @click:close="removeFile(file.name)"
        >
          <span class="text-truncate">{{ index + 1 + ". " + file.name }}</span>
          <span class="ms-1 text-decoration-underline">
            {{ file.accList.length + " accounts" }}
          </span>
        </v-chip>
      </v-fade-transition>
    </v-card>

    <v-divider />
    <div class="pa-4 text-right">
      <v-btn
        class="ms-1"
        color="error"
        small
        outlined
        rounded
        @click="clearFiles()"
      >
        Clear
        <v-icon right>mdi-close</v-icon>
      </v-btn>
      <v-btn
        class="ms-1"
        color="primary"
        small
        outlined
        rounded
        @click="uploadFiles()"
      >
        Add
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('ui/dialogImport', ['fileAccountList'])
  },
  methods: {
    ...mapActions('ui/dialogImport', ['removeFile', 'clearFiles']),
    uploadFiles () {
      this.$nuxt.$emit('clickImportFileInput')
    }
  }
}
</script>

<style>
</style>
