export const state = () => ({
    selectionMode: false,
    selectedItemList: [],
})

export const getters = {
    isSelected: (state) => (id) => {
        return !!state.selectedItemList.includes(id)
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
    deleteAccount({ dispatch }, acc) {
        dispatch("account/deleteAccount", acc, { root: true });
        dispatch("clearSelection")
    },
    showEditDialog({ dispatch }, acc) {
        dispatch("ui/toggleDialog", {
            type: "ACCOUNT_EDIT_DIALOG",
            val: true,
            id: acc.id,
        }, { root: true })
        dispatch('clearSelection')
    },
    showDeleteDialog({ dispatch }, acc) {
        dispatch("ui/toggleDialog", {
            type: "CONFIRMATION_DIALOG",
            val: true,
            data: {
                color: "error",
                title: "Delete account",
                desc:
                    "Are u sure you want to delete this " +
                    acc.appName +
                    " account with ID : " +
                    acc.accountId +
                    " ?",
                actions: {
                    y: () => {
                        dispatch('deleteAccount', acc)
                    },
                },
            },
        }
            , { root: true });
    },
    deleteItemMulti({dispatch,state}, sortedAccountList) {
        if (state.selectedItemList.length===1) {
          dispatch('showDeleteDialog', state.selectedItemList[0])
        } else {
          const itemList = sortedAccountList.filter((e) =>
            state.selectedItemList.includes(e.id)
          );
          dispatch("ui/toggleDialog", {
            type: "CONFIRMATION_DIALOG",
            val: true,
            data: {
              color: "error",
              title: "Delete account",
              desc:
                "Are u sure you want to delete these " +
                itemList.length +
                " accounts ?",
              actions: {
                y: () => {
                  itemList.forEach((e) => {
                    dispatch('deleteAccount',e)
                  });
                  dispatch('clearSelection')
                },
              },
            },
          },
          {root:true});
        }
      },
}
