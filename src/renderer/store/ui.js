export const state = () => ({
    mainDrawer: false,
    dummyMenuList: [
        ['mdi-email', 'Inbox'],
        ['mdi-account-supervisor-circle', 'Supervisors'],
        ['mdi-clock-start', 'Clock-in'],
    ]
})

export const getters = {
    getMenuList: (state) => () => {
        return state.dummyMenuList
    }

}

export const mutations = {
    TOGGLE_DRAWER(state, val) {
        state.mainDrawer = val
    }
}

export const actions = {
    toggleDrawer({ commit }, val) {
        commit('TOGGLE_DRAWER', val)
    }
}
