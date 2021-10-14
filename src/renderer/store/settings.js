export const state = () => ({
    hoverToShowPw: true,
    dialogToDelete: true,
    dblClickToEdit: false,
    darkTheme: false
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
    }
}

