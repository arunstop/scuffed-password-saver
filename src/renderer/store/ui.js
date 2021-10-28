export const state = () => ({
    menuList: require("@/assets/menu-list.json"),
    mainDrawer: false,
    initFolderDialog: true,
    logoutDialog: false,
    appAddDialog: false,
    appEditDialog: false,
    accountAddDialog: false,
    accountEditDialog: false,
    appEditValue: "",
    snackbarList: [],
    confirmationDialog: null,
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
    TOGGLE_APP_ADD_DIALOG(state, val) {
        state.appAddDialog = val
    },
    TOGGLE_APP_EDIT_DIALOG(state, val) {
        state.appEditDialog = val
    },
    TOGGLE_ACCOUNT_ADD_DIALOG(state, val) {
        state.accountAddDialog = val
    },
    TOGGLE_ACCOUNT_EDIT_DIALOG(state, val) {
        state.accountEditDialog = val
    },
    SHOW_SNACKBAR(state, payload) {
        const id = this.$globals.str.generateId()
        state.snackbarList.push({ id, ...payload })
        console.log(state.snackbarList)
    },
    REMOVE_SNACKBAR(state, id) {
        state.snackbarList = state.snackbarList.filter(s => s.id !== id)
    },
    TOGGLE_CONFIRMATION_DIALOG(state, payload) {
        if (payload === false) state.confirmationDialog = null
        else state.confirmationDialog = payload
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
    toggleAccountAddDialog({ commit }, val) {
        commit('TOGGLE_ACCOUNT_ADD_DIALOG', val)
    },
    toggleAccountEditDialog({ commit, dispatch }, payload) {
        // alert(payload.id)
        if (payload?.id) {
            commit('TOGGLE_ACCOUNT_EDIT_DIALOG', payload.val)
            dispatch('account/setAccountEditValue', payload.id, { root: true })
        } else {
            commit('TOGGLE_ACCOUNT_EDIT_DIALOG', payload.val)
            if (payload.val === false) dispatch('account/setAccountEditValue', "", { root: true })
        }
    },
    toggleConfirmationDialog({ commit }, payload) {
        commit('TOGGLE_CONFIRMATION_DIALOG', payload)
    },
    showSnackbar({ commit }, {label,color}) {
        commit('SHOW_SNACKBAR', {label,color})
    },
    removeSnackbar({ commit }, id) {
        commit('REMOVE_SNACKBAR', id)
    },
}
