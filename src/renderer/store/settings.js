export const state = () => ({
    hoverToShowPw: true,
    dialogToDelete: true,
    dblClickToEdit: false,
    darkTheme: false,
    vaultPath: '',
    reminderFreq: '3 months',
})

export const getters = {

}

export const mutations = {
    SET_LOCAL_SETTINGS(state) {
        this.$localStorage.set('settings', state)
    },
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
        state.vaultPath = path
    },
    SET_REMINDER_FREQ(state, val) {
        val = val.split(' ')[0]
        state.reminderFreq = val
    }
}


export const actions = {
    initSettings({ dispatch,commit }, payload) {
        if (payload) {
            dispatch('toggleHoverToShowPw', payload.hoverToShowPw)
            dispatch('toggleDialogToDelete', payload.dialogToDelete)
            dispatch('toggleDblClickToEdit', payload.dblClickToEdit)
            dispatch('toggleDarkTheme', payload.darkTheme)
            dispatch('setVaultPath', payload.vaultPath)
            dispatch('setReminderFreq', payload.reminderFreq)
        }
        commit('SET_LOCAL_SETTINGS')

    },
    toggleHoverToShowPw({ commit }, val) {
        commit('TOGGLE_HOVER_TO_SHOW_PW', val)
        commit('SET_LOCAL_SETTINGS')
    },
    toggleDialogToDelete({ commit }, val) {
        commit('TOGGLE_DIALOG_TO_DELETE', val)
        commit('SET_LOCAL_SETTINGS')
    },
    toggleDblClickToEdit({ commit }, val) {
        commit('TOGGLE_DBL_CLICK_TO_EDIT', val)
        commit('SET_LOCAL_SETTINGS')
    },
    toggleDarkTheme({ commit }, val) {
        commit('TOGGLE_DARK_THEME', val)
        commit('SET_LOCAL_SETTINGS')
    },
    setVaultPath({ commit, dispatch }, path) {
        commit('SET_VAULT_PATH', path)
        commit('SET_LOCAL_SETTINGS')
        dispatch('ui/toggleInitFolderDialog', false, { root: true })
        const snackbar = { label: "Vault folder is set! But, shhh! Don't tell anyone ;)", color: "success" }
        dispatch('ui/showSnackbar', snackbar, { root: true })
    },
    setReminderFreq({ commit }, val) {
        commit('SET_REMINDER_FREQ', val)
        commit('SET_LOCAL_SETTINGS')
    }
}

