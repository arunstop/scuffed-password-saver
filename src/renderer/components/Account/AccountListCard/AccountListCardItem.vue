<template>
  <v-col class="pa-0" lg="4" md="6" sm="6">
    <v-hover v-slot="{ hover }">
      <v-card
        class="ma-2 pa-0 elevation-6"
        link
        @contextmenu.prevent="!selectionMode && selectItem(acc.id)"
        @dblclick="!selectionMode && (!dblClickToEdit || showEditDialog(acc))"
        @click="selectionMode && selectItem(acc.id)"
      >
        <v-alert
          class="mb-0 pa-0"
          v-bind="getSelectedStyle(acc.id)"
          border="left"
        >
          <v-list-item class="align-stretch">
            <v-list-item-avatar>
              <UtilProfile :alpha="acc.appName" :color="color" />
            </v-list-item-avatar>
            <v-list-item-content class="d-block">
              <v-list-item-title
                class="font-weight-bold text-truncate"
                style="max-width: 150px"
                :class="color + '--text'"
              >
                {{ acc.accountId }}
              </v-list-item-title>
              <v-list-item-title
                class="text-truncate"
                style="max-width: 150px"
                :style="!hover && 'letter-spacing:1.4px; font-weight:bolder;'"
              >
                {{ hover && hoverToShowPw ? acc.accountPw : hiddenPw }}
              </v-list-item-title>
              <v-list-item-title class="font-weight-bold">
                <v-chip outlined small label color="primary">
                  {{ acc.appName }}
                </v-chip>
                <v-chip
                  class="ms-1 font-weight-bold"
                  :color="color"
                  outlined
                  small
                >
                  <v-icon left small>mdi-shield-plus-outline</v-icon>
                  {{ acc.durab.percentage + "%" }}
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
            <div class="ms-auto py-2">
              <v-slide-x-reverse-transition origin="center center">
                <div
                  v-if="hover"
                  class="d-flex flex-column fill-height justify-space-between"
                >
                  <v-icon color="primary" @click.prevent="showEditDialog(acc)">
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    class="mt-1"
                    color="error"
                    @click.self="!dialogToDelete || showDeleteDialog(acc)"
                    @dblclick.stop="dialogToDelete || deleteAccount(acc)"
                  >
                    mdi-delete
                  </v-icon>
                </div>
              </v-slide-x-reverse-transition>
            </div>
          </v-list-item>
        </v-alert>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: {
    acc: { type: Object, default: () => {} },
  },
  computed: {
    ...mapState("ui/accountList", ["selectionMode"]),
    ...mapGetters("ui/accountList", ["isSelected"]),
    ...mapState("settings", [
      "hoverToShowPw",
      "dialogToDelete",
      "dblClickToEdit",
      "darkTheme",
    ]),
    color() {
      return this.acc.durab.status;
    },
    hiddenPw() {
      let stars = "";
      for (let index = 0; index < this.acc.accountPw.length; index++) {
        stars = stars + "•";
      }
      return stars;
    },
  },
  methods: {
    ...mapActions("ui/accountList", [
      "selectItem",
      "clearSelection",
      "showEditDialog",
      "showDeleteDialog",
      "deleteAccount",
    ]),
    // :light="isSelectedInDark(acc.id)"
    //     :dark="isSelectedInLight(acc.id)"
    isSelectedInDark(id) {
      // IN DARK MODE
      // IF selected
      // TURN card into LIGHT THEME
      return this.$vuetify.theme.dark && this.isSelected(id);
    },
    isSelectedInLight(id) {
      // IN LIGHT MODE
      // IF selected
      // TURN card into DARK THEME
      return !this.$vuetify.theme.dark && this.isSelected(id);
    },
    getSelectedStyle(id) {
      return this.isSelected(id)
        ? { text: true, coloredBorder: false, color: "primary"}
        : { text: false, coloredBorder: true,color:this.color  };
    },
  },
};
</script>

<style>
</style>