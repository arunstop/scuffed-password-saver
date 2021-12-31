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
          v-bind="inSelectionStyle.card"
          border="bottom"
        >
          <v-card-text class="pa-0 d-flex flex-column justify-center">
            <v-sheet
              class="alcbi-bg rounded"
              :style="`background-image:${appIcon}`"
            >
              <v-overlay v-if="inSelection" absolute color="primary" />
              <!-- AppName -->
              <!-- <v-card
                class="d-flex rounded-0 elevation-0 justify-center transparent"
                width="100%"
              >
                <v-overlay
                  absolute
                  :color="
                    inSelection
                      ? 'primary'
                      : $vuetify.theme.dark
                      ? 'grey darken-4'
                      : 'grey lighten-4'
                  "
                  opacity="0.9"
                  z-index="0"
                />
                <v-chip
                  class="
                    pa-2
                    font-weight-medium
                    text-h6
                    elevation-0
                    pointer-events-none
                    user-select-none
                    transparent
                  "
                  label
                  :class="
                    inSelection
                      ? 'white--text'
                      : $vuetify.theme.dark
                      ? 'grey--text text--lighten-4'
                      : 'grey--text text--darken-4'
                  "
                  large
                  style="z-index: 0"
                >
                  {{ acc.appName }}
                </v-chip>
              </v-card> -->
              <v-card
                class="d-flex rounded-lg elevation-2 justify-center"
              >
                <v-chip
                  class="
                    pa-2
                    font-weight-medium
                    text-h6
                    elevation-0
                    pointer-events-none
                    user-select-none
                  "
                  label
                  :class="
                    inSelection
                      ? 'white--text'
                      : $vuetify.theme.dark
                      ? 'grey--text text--lighten-4'
                      : 'grey--text text--darken-4'
                  "
                  v-bind="inSelectionStyle.appName"
                  large
                  style="z-index: 0"
                >
                  {{ acc.appName }}
                </v-chip>
              </v-card>
            </v-sheet>
            <v-list-item class="pa-4">
              <v-list-item-content class="d-block pb-0">
                <!-- Username -->
                <v-list-item-title
                  class="font-weight-bold text-truncate mb-2"
                  :class="color + '--text'"
                >
                  {{ acc.accountId }}
                </v-list-item-title>
                <!-- Password -->
                <v-list-item-title
                  class="text-truncate sps-acc-pw mb-2"
                  :style="!hover && 'letter-spacing:1.4px; font-weight:bolder;'"
                >
                  {{ hover && hoverToShowPw ? acc.accountPw : hiddenPw }}
                </v-list-item-title>
                <!-- Pw durability -->
                <v-list-item-title class="font-weight-bold mb-2">
                  <v-chip
                    class="font-weight-bold"
                    :color="color"
                    :outlined="!inSelection"
                    small
                  >
                    <v-icon left small>mdi-shield-plus-outline</v-icon>
                    {{ acc.durab.percentage + "%" }}
                  </v-chip>
                </v-list-item-title>
                <!-- Added date -->
                <div class="mb-2">
                  <v-icon small class="me-1">mdi-plus</v-icon>
                  {{ dates().created.fromNow }}
                </div>
                <!-- Edited date -->
                <div class="mb-2">
                  <v-icon small class="me-1">mdi-pencil</v-icon>
                  {{ dates().edited.fromNow }}
                </div>
                <!-- Tags -->
                <div class="d-flex flex-wrap">
                  <v-icon v-if="acc.accountTags.length" small class="me-1 mb-1"
                    >mdi-tag</v-icon
                  >
                  <v-chip
                    v-for="(tag, idx) in tagList"
                    :key="idx"
                    small
                    class="me-1 mb-1"
                  >
                    {{ tag }}
                  </v-chip>
                  <v-chip
                    v-if="acc.accountTags.length >= 10"
                    small
                    class="me-1 mb-1"
                    outlined
                    color="grey darken-2"
                  >
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-alert>
        <div class="sps-alcbi-option">
          <v-slide-x-reverse-transition origin="center center">
            <div v-if="hover" class="d-flex flex-column justify-end py-4 pe-2">
              <v-btn
                class="rounded-lg mb-1"
                color="primary"
                small
                @click.prevent="showEditDialog(acc)"
              >
                Edit
                <v-icon right>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="rounded-lg mb-1"
                color="error"
                small
                @click="!dialogToDelete || showDeleteDialog(acc)"
                @dblclick.stop="dialogToDelete || deleteAccount(acc)"
              >
                Delete
                <v-icon right>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-slide-x-reverse-transition>
        </div>
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
    tagList() {
      return this.acc.accountTags.slice(0, 10);
    },
    inSelection() {
      return this.isSelected(this.acc.id);
    },
    color() {
      return this.acc.durab.status;
    },
    appIcon() {
      const themedColor = this.$vuetify.theme.dark ? "grey" : "grey";
      return this.getAppIcon(this.acc.appName).css.replaceAll(
        "currentColor",
        themedColor
      );
    },
    hiddenPw() {
      let stars = "";
      for (let index = 0; index < this.acc.accountPw.length; index++) {
        stars = stars + "•";
      }
      return stars;
    },
    inSelectionStyle() {
      const card = this.inSelection
        ? {
            text: true,
            coloredBorder: false,
            outlined: true,
            class: !this.$vuetify.theme.dark ? "alc-item-selected" : "",
            color: "primary",
          }
        : { text: false, coloredBorder: true, color: this.color };
      const appName = {
        outlined: !this.inSelection,
        color: this.inSelection
          ? "primary"
          : this.$vuetify.theme.dark
          ? "white"
          : "black",
      };
      return { card, appName };
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
      return this.$vuetify.theme.dark && this.inSelection;
    },
    isSelectedInLight(id) {
      // IN LIGHT MODE
      // IF selected
      // TURN card into DARK THEME
      return !this.$vuetify.theme.dark && this.inSelection;
    },
    dates() {
      const created = this.$date.moment(this.acc.created);
      const edited = this.$date.moment(this.acc.edited);
      return {
        created: {
          fromNow: created.fromNow(),
          fullDate: created.format("dddd, DD MMMM YYYY [at] HH:mm"),
        },
        edited: {
          fromNow: edited.fromNow(),
          fullDate: edited.format("dddd, DD MMMM YYYY [at] HH:mm"),
        },
      };
    },
  },
};
</script>

<style>
</style>
