export const state = function () {
    return {
        path: ''
    }
}

export const getters = {
    getMenuList: state => () => {
        return state.menuList
    }

}

export const mutations = {
    SET_PATH(state, path) {
        const vault = { path }
        this.$localStorage.set('vault', vault)
        state.path = path
    }
}

export const actions = {
    setPath({ commit, dispatch }, path) {
        commit('SET_PATH', path)
        dispatch('ui/toggleInitFolderDialog', false, { root: true })
        const snackbar = { label: "Vault folder is set! But, shhh! Don't tell anyone ;)", color: "success" }
        dispatch('ui/showSnackbar', snackbar, { root: true })
    }
}
