export const state = () => ({
    menuList: require("@/assets/menu-list.json"),
    mainDrawer: false,
    appEditValue: "",
    dialogList: [],
    snackbarList: [],
})

export const getters = {
    inDialogMode: state => () => {
        console.log(!!state.dialogList.length)
        return !!state.dialogList.length
    },
    isDialogActive: state => (dialogType) => {
        // console.log(state.dialogList.find(e => e.type === dialogType))
        return state.dialogList.find(e => e.type === dialogType) || false
    },
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
    SHOW_DIALOG(state, payload) {
        // console.log(payload)
        if (payload.val === true) {
            state.dialogList.push(payload)
            return
        }
        state.dialogList = state.dialogList.filter(e => e.type !== payload.type)
    },
    SHOW_SNACKBAR(state, payload) {
        const id = 'SNB_' + this.$globals.str.generateId()
        state.snackbarList.push({ id, ...payload })
        // console.log(state.snackbarList)
    },
    REMOVE_SNACKBAR(state, id) {
        state.snackbarList = state.snackbarList.filter(s => s.id !== id)
    },
}

export const actions = {
    toggleDrawer({ commit }, val) {
        commit('TOGGLE_DRAWER', val)
    },
    toggleDialog({ commit, dispatch }, payload) {
        const type = payload.type
        if (type === "INIT_FOLDER_DIALOG") {
            commit("SHOW_DIALOG", payload)
        }
        else if (type === "LOGOUT_DIALOG") {
            commit("SHOW_DIALOG", payload)
        }
        else if (type === "APP_ADD_DIALOG") {
            commit("SHOW_DIALOG", payload)
        }
        else if (type === "APP_EDIT_DIALOG") {
            commit("SHOW_DIALOG", payload)
            dispatch('app/setAppEditValue', payload.val === true ? payload.name : '', { root: true })
        }
        else if (type === "ACCOUNT_ADD_DIALOG") {
            commit("SHOW_DIALOG", payload)
        }
        else if (type === "ACCOUNT_EDIT_DIALOG") {
            commit("SHOW_DIALOG", payload)
            dispatch('account/setAccountEditValue', payload.val === true ? payload.id : '', { root: true })
        }
        else if (type === "CONFIRMATION_DIALOG") {
            commit("SHOW_DIALOG", payload)
        }
        else if (type === "IMPORT_DIALOG") {
            commit("SHOW_DIALOG", payload)
        }
    },
    showSnackbar({ commit }, { label, color }) {
        commit('SHOW_SNACKBAR', { label, color })
    },
    removeSnackbar({ commit }, id) {
        commit('REMOVE_SNACKBAR', id)
    },
}
