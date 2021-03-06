export const state = () => ({
    hoverToShowPw: true,
    dialogToDelete: true,
    dblClickToEdit: false,
    darkTheme: false,
    vaultPath: '',
    reminderFreq: 3,
    pwDuplication: false,
    pwDupLimit: 2,
    gapiToken: '',
    gapiProfile: '',
    accListView: 'table',
    scrollAutoLoad:false,
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
        this.app.vuetify.framework.theme.dark = val
    },
    SET_VAULT_PATH(state, path) {
        const vault = { path }
        state.vaultPath = path
    },
    SET_REMINDER_FREQ(state, val) {
        val = (val + "").split(' ')[0]
        state.reminderFreq = val
    },
    TOGGLE_PW_DUPLICATION(state, val) {
        state.pwDuplication = val
    },
    TOGGLE_SCROLL_AUTO_LOAD(state, val) {
        state.scrollAutoLoad = val
    },
    SET_PW_DUP_LIMIT(state, val) {
        state.pwDupLimit = val
    },
    SET_GAPI_TOKEN(state, val) {
        state.gapiToken = val
    },
    SET_GAPI_PROFILE(state, val) {
        state.gapiProfile = val
    },
    SET_ACC_LIST_VIEW(state, val) {
        state.accListView = val
    }
}


export const actions = {
    initSettings({ dispatch, commit }, payload) {
        if (payload) {
            dispatch('toggleHoverToShowPw', payload.hoverToShowPw)
            dispatch('toggleDialogToDelete', payload.dialogToDelete)
            dispatch('toggleDblClickToEdit', payload.dblClickToEdit)
            dispatch('toggleScrollAutoLoad', payload.scrollAutoLoad)
            dispatch('toggleDarkTheme', payload.darkTheme)
            dispatch('setVaultPath', payload.vaultPath)
            dispatch('setReminderFreq', payload.reminderFreq)
            dispatch('togglePwDuplication', payload.pwDuplication)
            dispatch('setPwDupLimit', payload.pwDupLimit)
            dispatch('setGapiToken', payload.gapiToken)
            dispatch('setGapiProfile', payload.gapiProfile)
            dispatch('setAccListView', payload.accListView)
        } else {
            dispatch('setVaultPath', this.$globals.getAppPath())
        }
        // set local storage settings
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
    toggleScrollAutoLoad({ commit }, val) {
        commit('TOGGLE_SCROLL_AUTO_LOAD', val)
        commit('SET_LOCAL_SETTINGS')
    },
    toggleDarkTheme({ commit }, val) {
        commit('TOGGLE_DARK_THEME', val)
        commit('SET_LOCAL_SETTINGS')
    },
    setVaultPath({ commit, dispatch }, path) {
        commit('SET_VAULT_PATH', path)
        commit('SET_LOCAL_SETTINGS')
        // console.log(path)
        // if no vault path
        // if(!path){
        // dispatch('ui/toggleDialog', { type: 'INIT_FOLDER_DIALOG', val: true }, { root: true })
        // }else{
        // const snackbar = { label: "Vault folder is set! But, shhh! Don't tell anyone ;)", color: "success" }
        // dispatch('ui/showSnackbar', snackbar, { root: true })
        // }
    },
    setReminderFreq({ commit }, val) {
        commit('SET_REMINDER_FREQ', val)
        commit('SET_LOCAL_SETTINGS')
    },
    togglePwDuplication({ commit }, val) {
        commit('TOGGLE_PW_DUPLICATION', val)
        commit('SET_LOCAL_SETTINGS')
    },
    setPwDupLimit({ commit }, val) {
        commit('SET_PW_DUP_LIMIT', val)
        commit('SET_LOCAL_SETTINGS')
    },
    setGapiToken({ commit }, val) {
        commit('SET_GAPI_TOKEN', val)
        commit('SET_LOCAL_SETTINGS')
    },
    setGapiProfile({ commit }, val) {
        commit('SET_GAPI_PROFILE', val)
        commit('SET_LOCAL_SETTINGS')
    },
    setAccListView({ commit }, val) {
        commit('SET_ACC_LIST_VIEW', val)
        commit('SET_LOCAL_SETTINGS')
    },
    
}

