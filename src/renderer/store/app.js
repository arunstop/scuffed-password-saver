import _ from 'lodash'

export const state = function () {
    return {
        appList: [],
        appEditValue: ""
    }
}

export const getters = {
    getAppByName: state => (name) => {
        // console.log(name)
        return state.appList.find(e => e.name.toLowerCase() === name.toLowerCase())
    },
    getAppList: (state, getters, rootState, rootGetters) => () => {
        // console.log(rootGetters)
        return state.appList
    },
    getAppListByAccount: (state, getters, rootState,) => () => {
        const accList = _.uniqBy(rootState.account.accountList.map(e => ({ name: e.appName, urls: "" })), "name")
        // console.log(accList)
        // // Getting apps that are listed in appList
        // const listedAppList = _.intersectionBy(
        //     state.appList,
        //     accList,
        //     "name"
        // )
        // console.log(state.appList)
        // console.log(listedAppList)
        // // Getting apps that are NOT listed in appList
        // const unlistedAppList = _.differenceBy(accList, listedAppList, "name")

        // if there are unlisted apps then push another "other apps" element
        // return listedAppList.concat(unlistedAppList ? { name: "Other", urls: "" } : [])

        return accList
    },
    getUnlistedApp: (state, getters, rootState) => () => {
        // pulling apps that are not listed in appList
        // but listed in accountList
        return _.pullAllBy(
            getters.getAppListByAccount(),
            state.appList,
            "name"
        )
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
        console.log(payload)
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
    IMPORT_APPS(state, payload) {
        payload = _.uniqBy(payload.map(e => ({ name: e.appName, urls: '' })), 'name')
        console.log(payload)
        const newApps = _.differenceBy(payload, state.appList, 'name')
        console.log(newApps)
        state.appList = state.appList.concat(newApps)
    }
}

export const actions = {
    initAppList({ commit }, payload) {
        commit('INIT_APP_LIST', payload)
    },
    setAppEditValue({ commit }, val) {
        commit('SET_APP_EDIT_VALUE', val)
    },
    addApp({ commit, dispatch }, payload) {
        payload.urls = require('lodash').uniqBy(payload.urls)
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
    },
    importApps({ commit }, payload) {
        commit('IMPORT_APPS', payload)
    }
}
