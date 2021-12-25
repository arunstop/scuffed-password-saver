import _ from 'lodash'
import { nanoid } from 'nanoid'

export const state = function () {
  return {
    accountList: [],
    accountEditValue: '',
    accountSearch: '',
    filterByAppList: [],
    extList: ['json', 'txt', 'csv', 'xls']
  }
}

export const getters = {
  getAccountList: state => () => {
    const keyword = state.accountSearch.toLowerCase().trim()
    return state.accountList
      .filter(acc =>
        state.filterByAppList.length
          ? state.filterByAppList.includes(acc.appName.toLowerCase().trim())
          : true
      )
      .filter(acc =>
        acc.accountId.toLowerCase().trim().includes(keyword) ||
        acc.accountTags?.toString().toLowerCase().trim().includes(keyword)
      )
  },
  getTagList: state => () => {
    const _ = require('lodash')
    let tl = []
    state.accountList.forEach((e) => {
      if (e.accountTags || e.accountTags?.length) {
        tl = tl.concat(_.compact(e.accountTags));
      }
    })

    // console.log(require('lodash').uniqBy(tl))
    return _.sortedUniq(tl)
  },
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
  isPwExist: state => (pw) => {
    const res = state.accountList.find(e =>
      e.accountPw === pw)
    return res
  },
  countPwDuplicates: (state, getters, rootState) => (pw) => {
    // console.log(state.accountList.filter(e => e.accountPw === pw))
    const count = state.accountList.filter(e => e.accountPw === pw).length
    const limit = rootState.settings.pwDupLimit
    // console.log({
    //     limit,
    //     count,
    //     full: count>=limit
    // })
    return {
      limit,
      count,
      available: count < limit,
      full: count >= limit
    }
  },

  countAccountByApp: state => (appName) => {
    return state.accountList.filter(acc =>
      acc.appName === appName
    ).length
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
    // const maxId = this.$globals.sortById(
    //     {
    //         arr: state.accountList.map(e => e.id),
    //         order: "desc",
    //         replacedWord: "ACC",
    //     })[0].replace('ACC', '')
    // const id = 'ACC' + ((maxId || 0) * 1 + 1)
    const id = this.$globals.str.generateId()
    const now = this.$date.moment().format()
    const dates = { created: now, edited: now, editedPw: now }
    state.accountList.push({ id, ...payload, ...dates })
    this.$localStorage.set('accountList', state.accountList)
    // console.log(this.$localStorage.get('accountList'))
  },
  IMPORT_ACCOUNTS(state, payload) {
    if (payload.mode === 'REPLACE') {
      // intersectionBy = insert array #1 to array #2
      // getting ALL unique non-duplicate array
      // if there are duplicates array #1 values are used
      state.accountList = _.unionBy(payload.value, state.accountList, 'id')
      // console.log(state.accountList)
      this.$localStorage.set('accountList', state.accountList)
    } else if (payload.mode === 'REPLACE_ADD') {
      // unionBy = insert array #1 to array #2
      // getting ALL unique non-duplicate array
      // if there are duplicates array #1 values are used
      state.accountList = _.unionBy(payload.value, state.accountList, 'id')
      // console.log(state.accountList)
      this.$localStorage.set('accountList', state.accountList)
    } else if (payload.mode === 'ADD') {
      state.accountList = _.concat(state.accountList, payload.value)
      // console.log(state.accountList)
      this.$localStorage.set('accountList', state.accountList)
    }
  },
  EDIT_ACCOUNT(state, payload) {
    // console.log(payload)
    const targetedItem = state.accountList.find(e => e.id === payload.id)
    // console.log(targetedItem)
    const now = this.$date.moment().format()
    const editedPw = () => {
      if (payload.accountPw !== targetedItem.accountPw) {
        return now
      }
      return targetedItem.editedPw
    }
    state.accountList = state.accountList.filter(e => e.id !== payload.id)
    state.accountList.push({ ...state.accountEditValue, ...payload, edited: now, editedPw: editedPw() })
    this.$localStorage.set('accountList', state.accountList)
    // console.log(targetedAccount)
  },
  DELETE_ACCOUNT(state, id) {
    state.accountList = state.accountList.filter(e => e.id !== id)
    this.$localStorage.set('accountList', state.accountList)
  },
  SET_ACCOUNT_SEARCH(state, val) {
    state.accountSearch = val
  },
  ADD_FILTER_BY_APP(state, val) {
    val = val.toLowerCase().trim()
    if (state.filterByAppList.includes(val)) { return }
    state.filterByAppList.push(val)
  },
  REMOVE_FILTER_BY_APP(state, val) {
    if (val === '*') {
      state.filterByAppList = []
      return
    }
    state.filterByAppList = state.filterByAppList.filter(e => e !== val.trim().toLowerCase())
  }
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
    dispatch('ui/showSnackbar', {
      label: 'A new account for ' + payload.appName + ' has been added',
      color: 'success'
    },
      { root: true }
    )
  },
  editAccount({ commit, dispatch }, payload) {
    // console.log(payload)
    commit('EDIT_ACCOUNT', payload)
    dispatch('ui/showSnackbar',
      {
        label: 'Account has been updated',
        color: 'success'
      },
      { root: true }
    )
  },
  deleteAccount({ commit, dispatch, getters }, payload) {
    commit('DELETE_ACCOUNT', payload.id)
    // remove filters of deleted apps
    if (getters.countAccountByApp(payload.appName) === 0) {
      dispatch('removeFilterByApp', payload.appName)
    }
    if (!payload.noSnackbar) {
      dispatch('ui/showSnackbar',
        {
          label: 'Account has been deleted',
          color: 'success'
        },
        { root: true }
      )
    }
  },
  setAccountSearch({ commit }, val) {
    commit('SET_ACCOUNT_SEARCH', val)
  },
  addFilterByApp({ commit }, val) {
    commit('ADD_FILTER_BY_APP', val)
  },
  removeFilterByApp({ commit }, val) {
    commit('REMOVE_FILTER_BY_APP', val)
  },
  importAccount({ commit, dispatch }, payload) {
    // console.log(payload)
    commit('IMPORT_ACCOUNTS', payload)
    dispatch('app/importApps', payload.value, { root: true })
  }
}
