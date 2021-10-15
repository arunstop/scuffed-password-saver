export const state = () => ({
    hoverToShowPw: true,
    dialogToDelete: true,
    dblClickToEdit: false,
    darkTheme: false,
    vaultPath: ''
})

export const getters = {

}

export const mutations = {
    TOGGLE_HOVER_TO_SHOW_PW(state, val) {
        state.hoverToShowPw = val
    },
    TOGGLE_DIALOG_TO_DELETE(state, val) {
        state.dialogToDelete = val
    },
    TOGGLE_DBL_CLICK_TO_EDIT(state, val) {
        state.dblClickToEdit = val
    },
    TOGGLE_DARK_THEME(state, val) {
        state.darkTheme = val
    },
    SET_VAULT_PATH(state, path) {
        const vault = { path }
        this.$localStorage.set('vault', vault)
        state.vaultPath = path
    }
}


export const actions = {
    toggleHoverToShowPw({ commit }, val) {
        commit('TOGGLE_HOVER_TO_SHOW_PW', val)
    },
    toggleDialogToDelete({ commit }, val) {
        commit('TOGGLE_DIALOG_TO_DELETE', val)
    },
    toggleDblClickToEdit({ commit }, val) {
        commit('TOGGLE_DBL_CLICK_TO_EDIT', val)
    },
    toggleDarkTheme({ commit }, val) {
        commit('TOGGLE_DARK_THEME', val)
    },
    setVaultPath({ commit, dispatch }, path) {
        commit('SET_VAULT_PATH', path)
        dispatch('ui/toggleInitFolderDialog', false, { root: true })
        const snackbar = { label: "Vault folder is set! But, shhh! Don't tell anyone ;)", color: "success" }
        dispatch('ui/showSnackbar', snackbar, { root: true })
    }
}

