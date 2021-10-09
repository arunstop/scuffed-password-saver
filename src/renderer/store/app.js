export const state = function () {
    return {
        appList: [],
        appEditValue: ""
    }
}

export const getters = {
    getAppByName: state => (name) => {
        console.log(name)
        return state.appList.find(e => e.name.toLowerCase() === name.toLowerCase())
    },
    getAppList:state=>()=>{
        return state.appList
    }
}

export const mutations = {
    INIT_APP_LIST(state, payload) {
        state.appList = payload
        this.$localStorage.set('appList', state.appList)
        // console.log(this.$localStorage.get('appList'))
    },
    SET_APP_EDIT_VALUE(state, name) {
        state.appEditValue = state.appList.find(e => e.name.toLowerCase() === name.toLowerCase())
        // console.log(name)
    },
    ADD_APP(state, payload) {
        state.appList.push(payload)
        this.$localStorage.set('appList', state.appList)
        // console.log(this.$localStorage.get('appList'))
    },
    EDIT_APP(state, payload) {
        const targetedApp = state.appList.find(e => e.name.toLowerCase() === payload.oldName.toLowerCase())
        targetedApp.name = payload.name
        targetedApp.urls = payload.urls
        this.$localStorage.set('appList', state.appList)
        // console.log(targetedApp)
    },
    DELETE_APP(state, name) {
        state.appList = state.appList.filter(e => e.name.toLowerCase() !== name.toLowerCase())
        this.$localStorage.set('appList', state.appList)
    },
}

export const actions = {
    initAppList({ commit }, payload) {
        commit('INIT_APP_LIST', payload)
    },
    setAppEditValue({ commit }, val) {
        commit('SET_APP_EDIT_VALUE', val)
    },
    addApp({ commit, dispatch }, payload) {
        // console.log(payload)
        commit('ADD_APP', payload)
        dispatch("ui/showSnackbar", {
            label: "App : " + payload.name + " has been added",
            color: "success",
        },
            { root: true })
    },
    editApp({ commit, dispatch }, payload) {
        console.log(payload)
        commit('EDIT_APP', payload)
        dispatch("ui/showSnackbar",
            {
                label: payload.oldName + " has been updated",
                color: "success",
            },
            { root: true })
    },
    deleteApp({ commit, dispatch }, name) {
        commit('DELETE_APP', name)
        dispatch("ui/showSnackbar",
            {
                label: name + "  has been deleted",
                color: "success",
            },
            { root: true })
    }
}
