<template>
  <v-col class="pa-2" lg="4" md="4" sm="6">
    <v-hover v-slot="{ hover }">
      <v-card
        max-width="350px"
        class="ma-auto pa-0 elevation-6 transparent"
        link
        @contextmenu.prevent="!selectionMode && selectItem(acc.id)"
        @dblclick="!selectionMode && (!dblClickToEdit || showEditDialog(acc))"
        @click="selectionMode && selectItem(acc.id)"
      >
        <v-alert
          class="mb-0 pa-0 alc-item-outlined elevation-2"
          v-bind="getSelectedStyle(acc.id)"
          border="left"
        >
          <v-list-item class="align-stretch">
            <v-list-item-avatar rounded="lg" :style="`background-image:${appIcon};background-size:contain;`">
              <!-- <UtilProfile :alpha="acc.appName" :color="color" /> -->
            </v-list-item-avatar>
            <v-list-item-content class="d-block">
              <v-list-item-title
                class="font-weight-bold text-truncate"
                :class="color + '--text'"
              >
                {{ acc.accountId }}
              </v-list-item-title>
              <v-list-item-title
                class="text-truncate sps-acc-pw"
                :style="!hover && 'letter-spacing:1.4px; font-weight:bolder;'"
              >
                {{ hover && hoverToShowPw ? acc.accountPw : hiddenPw }}
              </v-list-item-title>
              <v-list-item-title class="font-weight-bold">
                <v-chip
                  :outlined="!inSelection"
                  small
                  label
                  color="primary"
                >
                  {{ acc.appName }}
                </v-chip>
                <v-chip
                  class="ms-1 font-weight-bold"
                  :color="color"
                  :outlined="!inSelection"
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
    ...mapGetters("app", ["getAppIcon"]),
    ...mapState("settings", [
      "hoverToShowPw",
      "dialogToDelete",
      "dblClickToEdit",
      "darkTheme",
    ]),
    inSelection(){
      return this.isSelected(this.acc.id)
    },
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
    appIcon() {
      const themedColor = this.$vuetify.theme.dark ? "grey" : "grey";
      return this.getAppIcon(this.acc.appName).css.replaceAll(
        "currentColor",
        themedColor
      );
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
        ? {
            text: true,
            coloredBorder: false,
            outlined: true,
            class: !this.$vuetify.theme.dark ? "alc-item-selected" : "",
            color: "primary",
          }
        : { text: false, coloredBorder: true, color: this.color };
    },
  },
};
</script>

<style>

</style>
