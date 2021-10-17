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
        // console.log(state.accountList)
    },
    SET_ACCOUNT_EDIT_VALUE(state, id) {
        // alert(state.accountList)
        state.accountEditValue = state.accountList.find(e => e.id === id)
        // console.log(state.accountEditValue)
    },
    ADD_ACCOUNT(state, payload) {
        const maxId = this.$globals.sortById(
            {
                arr: state.accountList.map(e => e.id),
                order: "desc",
                replacedWord: "ACC",
            })[0].replace('ACC','')
        const id = 'ACC' + (maxId + 1)
        const now = this.$date.moment()
        const dates = { created: now, edited: now }
        state.accountList.push({ id, ...payload, ...dates })
        this.$localStorage.set('accountList', state.accountList)
        // console.log(this.$localStorage.get('accountList'))
    },
    EDIT_ACCOUNT(state, payload) {
        // console.log(payload)
        state.accountList = state.accountList.filter(e => e.id !== payload.id)
        state.accountList.push({ ...state.accountEditValue, ...payload, edited: this.$date.now })
        this.$localStorage.set('accountList', state.accountList)
        // console.log(targetedAccount)
    },
    DELETE_ACCOUNT(state, id) {
        state.accountList = state.accountList.filter(e => e.id !== id)
        this.$localStorage.set('accountList', state.accountList)
    },
}

export const actions = {
    initAccountList({ commit }, payload) {
        commit('INIT_ACCOUNT_LIST', payload)
    },
    setAccountEditValue({ commit }, id) {
        commit('SET_ACCOUNT_EDIT_VALUE', id)
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
        // console.log(payload)
        commit('EDIT_ACCOUNT', payload)
        dispatch("ui/showSnackbar",
            {
                label: "Account has been updated",
                color: "success",
            },
            { root: true })
    },
    deleteAccount({ commit, dispatch }, id) {
        commit('DELETE_ACCOUNT', id)
        dispatch("ui/showSnackbar",
            {
                label: "Account has been deleted",
                color: "success",
            },
            { root: true })
    }
}
