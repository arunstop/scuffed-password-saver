import _ from 'lodash'

export const state = function () {
  return {
    appList: [],
    appEditValue: ''
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
  getAppIcon: (state, getters) => (name) => {
    const appiconDefaultSvg = require('~/assets/appicon-default-svg.json').val
    const icon = state.appList.find(e => e.name.toLowerCase().trim() === name.toLowerCase().trim())?.icon
    return icon ? `url(${icon}), url(${appiconDefaultSvg})` : `url(${appiconDefaultSvg})`;
  },
  getAppListByAccount: (state, getters, rootState) => () => {
    const accList = _.uniqBy(rootState.account.accountList.map(e => ({ name: e.appName, urls: '' })), 'name')
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
      'name'
    )
  },
  getUrllessApp: state => () => {
    return state.appList.filter(e => e.urls.length === 0).length
  }
}

export const mutations = {
  SET_LOCAL_APPLIST(state, payload) {
    this.$localStorage.set('appList', state.appList)
  },
  INIT_APP_LIST(state, payload) {
    state.appList = payload
    // this.$localStorage.set('appList', state.appList)
    // console.log(this.$localStorage.get('appList'))
  },
  SET_APP_EDIT_VALUE(state, name) {
    state.appEditValue = state.appList.find(e => e.name.toLowerCase() === name.toLowerCase())
    // console.log(name)
  },
  ADD_APP(state, payload) {
    // console.log(payload)
    state.appList.push(payload)
    // this.$localStorage.set('appList', state.appList)
    // console.log(this.$localStorage.get('appList'))
  },
  EDIT_APP(state, payload) {
    const targetedApp = state.appList.find(e => e.name.toLowerCase() === payload.oldName.toLowerCase())
    targetedApp.name = payload.name
    targetedApp.urls = payload.urls
    // this.$localStorage.set('appList', state.appList)
    // console.log(targetedApp)
  },
  DELETE_APP(state, name) {
    state.appList = state.appList.filter(e => e.name.toLowerCase() !== name.toLowerCase())
    // this.$localStorage.set('appList', state.appList)
  },
  IMPORT_APPS(state, payload) {
    payload = _.uniqBy(payload.map(e => ({ name: e.appName, urls: '' })), 'name')
    // console.log(payload)
    const newApps = _.differenceBy(payload, state.appList, 'name')
    // console.log(newApps)
    state.appList = state.appList.concat(newApps)
  },
  SET_ICON(state, payload) {
    // console.log(payload)
    const target = state.appList.find(e => e.name === payload.name)
    // set icon
    target.icon = payload.url
    console.log(target)
    state.appList = state.appList.filter(e => e.name !== payload.name)
    state.appList.push(target)
    // console.log(state.appList)

  }
}

export const actions = {
  initAppList({ commit }, payload) {
    commit('INIT_APP_LIST', payload)
    commit('SET_LOCAL_APPLIST')
  },
  setAppEditValue({ commit }, val) {
    commit('SET_APP_EDIT_VALUE', val)
  },
  addApp({ commit, dispatch }, payload) {
    payload.urls = require('lodash').uniqBy(payload.urls)
    commit('ADD_APP', { ...payload, icon: "" })
    commit('SET_LOCAL_APPLIST')
    if (!payload.noSnackbar) {
      dispatch('ui/showSnackbar', {
        label: 'App : ' + payload.name + ' has been added',
        color: 'success'
      },
        { root: true })
    }
  },
  editApp({ commit, dispatch }, payload) {
    // console.log(payload)
    commit('EDIT_APP', payload)
    commit('SET_LOCAL_APPLIST')
    dispatch('ui/showSnackbar',
      {
        label: payload.oldName + ' has been updated',
        color: 'success'
      },
      { root: true })
  },
  deleteApp({ commit, dispatch }, name) {
    commit('DELETE_APP', name)
    commit('SET_LOCAL_APPLIST')
    dispatch('ui/showSnackbar',
      {
        label: name + '  has been deleted',
        color: 'success'
      },
      { root: true })
  },
  importApps({ commit }, payload) {
    commit('IMPORT_APPS', payload)
  },
  setIcon({ commit }, payload) {
    console.log(payload)
    // commit('SET_ICON', {
    //   "name": "Facebook",
    //   "url": "https://static.xx.fbcdn.net/rsrc.php/yv/r/B8BxsscfVBr.ico"
    // })
    commit('SET_ICON', payload)
    commit('SET_LOCAL_APPLIST')

  },
  completeAppListing({ dispatch }, unlistedAppList) {
    // if only 1 app to be added
    if (unlistedAppList.length === 1) {
      const app = unlistedAppList[0]
      dispatch('addApp', {
        name: app.name,
        urls: '',
      }
      )
    }
    // if multiple apps to be added
    else {
      unlistedAppList.forEach((e) => {
        dispatch('addApp', {
          name: e.name,
          urls: '',
          noSnackbar: true
        }
        )
      })
      dispatch('ui/showSnackbar',
        {
          label: `${unlistedAppList.length} apps/websites has been added`,
          color: 'success'
        },
        { root: true }
      )
    }
  }
}
