export const state = function () {
    return {
        accountList: [],
        accountEditValue: ""
    }
}

export const getters = {
    isAccountExist: state => (appName, accountId) => {
        // console.log(appName)
        // console.log(accountId)
        const res = state.accountList.find(e =>
            e.appName.toLowerCase() === appName.toLowerCase() &&
            e.accountId === accountId
        )
        console.log(res)
        return res
    },
    getAccountList: state => () => {
        return state.accountList
    }
}

export const mutations = {
    INIT_ACCOUNT_LIST(state, payload) {
        state.accountList = payload
        this.$localStorage.set('accountList', state.accountList)
        // console.log(this.$localStorage.get('accountList'))
    },
    SET_ACCOUNT_EDIT_VALUE(state, name) {
        state.accountEditValue = state.accountList.find(e => e.name.toLowerCase() === name.toLowerCase())
        // console.log(name)
    },
    ADD_ACCOUNT(state, payload) {
        state.accountList.push(payload)
        this.$localStorage.set('accountList', state.accountList)
        // console.log(this.$localStorage.get('accountList'))
    },
    EDIT_ACCOUNT(state, payload) {
        const targetedAccount = state.accountList.find(e => e.name.toLowerCase() === payload.oldName.toLowerCase())
        targetedAccount.name = payload.name
        targetedAccount.urls = payload.urls
        this.$localStorage.set('accountList', state.accountList)
        // console.log(targetedAccount)
    },
    DELETE_ACCOUNT(state, name) {
        state.accountList = state.accountList.filter(e => e.name.toLowerCase() !== name.toLowerCase())
        this.$localStorage.set('accountList', state.accountList)
    },
}

export const actions = {
    initAccountList({ commit }, payload) {
        commit('INIT_ACCOUNT_LIST', payload)
    },
    setAccountEditValue({ commit }, val) {
        commit('SET_ACCOUNT_EDIT_VALUE', val)
    },
    addAccount({ commit, dispatch }, payload) {
        // console.log(payload)
        commit('ADD_ACCOUNT', payload)
        dispatch("ui/showSnackbar", {
            label: "A new account for "+payload.appName+" has been added",
            color: "success",
        },
            { root: true })
    },
    editAccount({ commit, dispatch }, payload) {
        console.log(payload)
        commit('EDIT_ACCOUNT', payload)
        dispatch("ui/showSnackbar",
            {
                label: payload.oldName + " has been updated",
                color: "success",
            },
            { root: true })
    },
    deleteAccount({ commit, dispatch }, name) {
        commit('DELETE_ACCOUNT', name)
        dispatch("ui/showSnackbar",
            {
                label: name + "  has been deleted",
                color: "success",
            },
            { root: true })
    }
}
