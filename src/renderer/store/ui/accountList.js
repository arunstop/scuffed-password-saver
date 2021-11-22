export const state = () => ({
  selectionMode: false,
  selectedItemList: [],
  sortByValue: { val: 'edited', order: 'desc' },
  sortByList: [
    { val: 'edited', label: 'Last Edited', labelSort: 'Edited', icon: 'mdi-pencil-outline' },
    { val: 'appName', label: 'Application/Website', labelSort: 'App/Web', icon: 'mdi-application-outline' },
    { val: 'accountId', label: 'ID/Username/Email/Phone', labelSort: 'ID/Email', icon: 'mdi-at' },
    { val: 'durab.percentage', label: 'Password Durability', labelSort: 'Pw Durab.', icon: 'mdi-shield-plus-outline' },
    { val: 'created', label: 'Date Created', labelSort: 'Created', icon: 'mdi-plus-circle-outline' }

  ],
  orderValue: { val: 'desc', label: 'Descending',labelSort: 'DESC', icon: 'mdi-sort-descending' },
  orderList: [
    { val: 'asc', label: 'ASCENDING', labelSort: 'ASC', icon: 'mdi-sort-ascending' },
    { val: 'desc', label: 'DESCENDING', labelSort: 'DESC', icon: 'mdi-sort-descending' }
  ],
  paging: {
    page: 1,
    count: 10,
  }
})

export const getters = {
  isSelected: state => (id) => {
    return !!state.selectedItemList.includes(id)
  },
  getActiveSortByValue: state => () => {
    return state.sortByList.find(e => e.val === state.sortByValue.val)
  }
}

export const mutations = {
  SELECT_ITEM(state, id) {
    state.selectedItemList.push(id)
  },
  SELECT_ITEM_MULTI(state, idList) {
    state.selectedItemList = idList
  },
  DESELECT_ITEM(state, id) {
    state.selectedItemList = state.selectedItemList.filter(e => e !== id)
  },
  START_SELECTION(state) {
    state.selectionMode = true
  },
  CLEAR_SELECTION(state) {
    state.selectionMode = false
    state.selectedItemList = []
  },
  SET_SORT_BY_VALUE(state, v) {
    state.sortByValue = v
  },
  SET_ORDER_VALUE(state, v) {
    state.orderValue = state.orderList.find(e => e.val !== v)
  },
  NEXT_PAGE(state) {
    state.paging.page += 1
  }
}

export const actions = {
  selectItem({ commit, state }, id) {
    if (state.selectionMode === false) {
      commit('START_SELECTION')
    }
    if (state.selectedItemList.includes(id)) {
      commit('DESELECT_ITEM', id)
      return
    }
    commit('SELECT_ITEM', id)
  },
  selectItemMulti({ commit, state }, idList) {
    if (state.selectionMode === false) {
      commit('START_SELECTION')
    }
    commit('SELECT_ITEM_MULTI', idList)
  },
  clearSelection({ commit }, val) {
    commit('CLEAR_SELECTION')
  },
  setSortByValue({ commit }, val) {
    commit('SET_SORT_BY_VALUE', val)
  },
  setOrderValue({ commit }, val) {
    commit('SET_ORDER_VALUE', val)
  },
  deleteAccount({ dispatch }, acc) {
    dispatch('account/deleteAccount', acc, { root: true })
    dispatch('clearSelection')
  },
  showEditDialog({ dispatch }, acc) {
    dispatch('ui/toggleDialog', {
      type: 'ACCOUNT_EDIT_DIALOG',
      val: true,
      id: acc.id
    }, { root: true })
    dispatch('clearSelection')
  },
  showDeleteDialog({ dispatch }, acc) {
    dispatch('ui/toggleDialog', {
      type: 'CONFIRMATION_DIALOG',
      val: true,
      data: {
        color: 'error',
        title: 'Delete account',
        desc:
          'Are u sure you want to delete this ' +
          acc.appName +
          ' account with ID : ' +
          acc.accountId +
          ' ?',
        actions: {
          y: () => {
            dispatch('deleteAccount', acc)
          }
        }
      }
    }
      , { root: true })
  },
  deleteAccountMulti({ dispatch, state,rootState }) {
const accList = rootState.account.accountList
    if (state.selectedItemList.length === 1) {
      dispatch('showDeleteDialog', accList.find(e => e.id === state.selectedItemList[0]))
    } else {
      const itemList = accList.filter(e =>
        state.selectedItemList.includes(e.id)
      )
      dispatch('ui/toggleDialog', {
        type: 'CONFIRMATION_DIALOG',
        val: true,
        data: {
          color: 'error',
          title: 'Delete account',
          desc:
            'Are you sure you want to delete these ' +
            itemList.length +
            ' accounts ?',
          actions: {
            y: () => {
              itemList.forEach((e) => {
                dispatch('deleteAccount', { ...e, noSnackbar: true })
              })
              dispatch('clearSelection')
              dispatch('ui/showSnackbar',
                {
                  label: `${itemList.length} accounts has been deleted`,
                  color: 'success'
                },
                { root: true }
              )
            }
          }
        }
      },
        { root: true })
    }
  },
  nextPage({ commit }) {
    commit('NEXT_PAGE')
  }

}
