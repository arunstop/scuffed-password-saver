export const state = function () {
    return {
        appList: []
    }
}

export const getters = {
    getAppByName: state => (name) => {
        return state.appList.find(e => e.name.toLowerCase() === name.toLowerCase())
    }
}

export const mutations = {
    INIT_APP_LIST(state, payload) {
        state.appList = payload
        this.$localStorage.set('appList', state.appList)
        console.log(this.$localStorage.get('appList'))
    },
    ADD_APP(state, payload) {
        state.appList.push(payload)
        this.$localStorage.set('appList', state.appList)
        console.log(this.$localStorage.get('appList'))
    }
}

export const actions = {
    initAppList({ commit }, payload) {
        commit('INIT_APP_LIST', payload)
    },
    addApp({ commit }, payload) {
        // console.log(payload)
        commit('ADD_APP', payload)
    },
}
