export const state = () => ({
    menuList: require("@/assets/menu-list.json"),
    mainDrawer: true,
    initFolderDialog: true,
    logoutDialog: false,
    addAccountDialog: false,
    appAddDialog: false,
    appEditDialog: false,
    appEditValue: "",
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
    TOGGLE_ADD_ACCOUNT_DIALOG(state, val) {
        state.addAccountDialog = val
    },
    TOGGLE_APP_ADD_DIALOG(state, val) {
        state.appAddDialog = val
    },
    TOGGLE_APP_EDIT_DIALOG(state, val) {
        state.appEditDialog = val
    },
    ADD_SNACKBAR(state, payload) {
        const id = state.snackbarList.length + 1
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
    toggleAddAccountDialog({ commit }, val) {
        commit('TOGGLE_ADD_ACCOUNT_DIALOG', val)
    },
    toggleAppAddDialog({ commit }, val) {
        commit('TOGGLE_APP_ADD_DIALOG', val)
    },
    toggleAppEditDialog({ commit, dispatch }, payload) {
        if (payload?.name) {
            commit('TOGGLE_APP_EDIT_DIALOG', payload.val)
            dispatch('app/setAppEditValue', payload.name, { root: true })
        } else {
            commit('TOGGLE_APP_EDIT_DIALOG', payload.val)
            if (payload.val === false) dispatch('app/setAppEditValue', "", { root: true })
        }
    },
    addSnackbar({ commit }, payload) {
        commit('ADD_SNACKBAR', payload)
    },
    removeSnackbar({ commit }, id) {
        commit('REMOVE_SNACKBAR', id)
    },
}
