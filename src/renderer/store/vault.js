export const state = () => ({
    path: "",
})

export const getters = {
    getMenuList: (state) => () => {
        return state.menuList
    }

}

export const mutations = {
    SET_PATH(state, path) {
        state.path = path
    }
}

export const actions = {
    setPath({ commit, dispatch }, path) {
        commit('SET_PATH', path)
        dispatch('ui/toggleInitFolderDialog', false, { root: true })
    }
    ,
}
