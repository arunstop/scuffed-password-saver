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
        // console.log(res)
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
        console.log(state.accountList)
    },
    SET_ACCOUNT_EDIT_VALUE(state, account) {
        // alert(state.accountList)
        state.accountEditValue = state.accountList.find(e =>
            e.appName.toLowerCase() === account.appName.toLowerCase() &&
            e.accountId === account.accountId
        )
        console.log(state.accountEditValue)
    },
    ADD_ACCOUNT(state, payload) {
        state.accountList.push(payload)
        this.$localStorage.set('accountList', state.accountList)
        // console.log(this.$localStorage.get('accountList'))
    },
    EDIT_ACCOUNT(state, account) {
        let targetedAccount = state.accountList.find(e =>e===account)
        targetedAccount=account
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
            label: "A new account for " + payload.appName + " has been added",
            color: "success",
        },
            { root: true })
    },
    editAccount({ commit, dispatch }, payload) {
        console.log(payload)
        commit('EDIT_ACCOUNT', payload)
        dispatch("ui/showSnackbar",
            {
                label: "Account has been updated",
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
