export const state = () => ({
    menuList : require("@/assets/menu-list.json"),
    mainDrawer: false,
    initFolderDialog: true,
    logoutDialog: false,
})

export const getters = {
    getMenuList: (state) => () => {
        return state.menuList
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
}
