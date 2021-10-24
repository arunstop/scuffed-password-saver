<template>
  <div>
      <v-list-item class="">
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-black normal-white-space text-h5"
          >
            <v-icon class="primary--text mb-1"> mdi-lock-clock </v-icon>
            Password Change Reminder
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-break normal-white-space subtitle-2"
          >
            Set how frequent app will be at reminding you to change your
            password.
          </v-list-item-subtitle>
        </v-list-item-content>
        <div class="ms-2" style="max-width: 180px">
          <v-select
            v-model="reminderFreqModel"
            :items="reminderFreqItems"
            outlined
            hide-details
          >
          </v-select>
        </div>
      </v-list-item>
      <v-divider />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("settings", ["reminderFreq"]),
    reminderFreqModel: {
      get() {
        const v = this.reminderFreq;
        return v + (v * 1 === 1 ? " month" : " months");
      },
      set(v) {
        this.$store.dispatch("settings/setReminderFreq", v);
      },
    },
    reminderFreqItems() {
      const rf = [];
      for (let i = 1; i <= 12; i++) {
        rf.push(i + (i === 1 ? " month" : " months"));
      }
      return rf;
    },
  },
};
</script>

<style>

</style>