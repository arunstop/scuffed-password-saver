import { stat } from "original-fs"

export const state = () => ({
    menuList: require("@/assets/menu-list.json"),
    mainDrawer: false,
    initFolderDialog: true,
    logoutDialog: false,
    snackbarList: [],
})

export const getters = {
    getMenuList: state => () => {
        return state.menuList
    },
    getSnackbarList: state => () => {
        return state.snackbarList
    },
    getSnackbarById: state => id => {
        return state.snackbarList.find(s => s.id === id)
    }
}

export const mutations = {
    TOGGLE_DRAWER(state, val) {
        state.mainDrawer = val
    },
    TOGGLE_INIT_FOLDER_DIALOG(state, val) {
        state.initFolderDialog = val
    },
    TOGGLE_LOGOUT_DIALOG(state, val) {
        state.logoutDialog = val
    },
    ADD_SNACKBAR(state, payload) {
        const id = state.snackbarList.length+1
        state.snackbarList.push({ id, ...payload })
    },
    REMOVE_SNACKBAR(state, id) {
        state.snackbarList = state.snackbarList.filter(s => s.id !== id)
    }
}

export const actions = {
    toggleDrawer({ commit }, val) {
        commit('TOGGLE_DRAWER', val)
    },
    toggleInitFolderDialog({ commit }, val) {
        commit('TOGGLE_INIT_FOLDER_DIALOG', val)
    },
    toggleLogoutDialog({ commit }, val) {
        commit('TOGGLE_LOGOUT_DIALOG', val)
    },
    addSnackbar({ commit }, payload) {
        commit('ADD_SNACKBAR', payload)
    },
    removeSnackbar({ commit }, id) {
        commit('REMOVE_SNACKBAR', id)
    },
}
