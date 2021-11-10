export const state = () => ({
    filesRaw: [],
    files: [],
    fileList: []
})

export const getters = {
    getFileList: (state) => () => {
        const fileDetailList = [];
        state.files.forEach((e) => {
            const accList = JSON.parse(require("fs").readFileSync(e.path));
            fileDetailList.push(require('lodash').assign(e, { accList }));
        });
        return fileDetailList || [];
    },
    getUploadResult: (state, getters, rootState) => () => {

        const _ = require('lodash');
        const alCurrent = rootState.account.accountList
        const alRaw = getters.getFileList()
            .map((e) => e.accList)
            .reduce((p, c) => p.concat(c), []);
        const alFound = _.uniqBy(alRaw, "id");

        const alDuplicate = _.intersectionBy(_.clone(alFound), alCurrent, "id");
        const alNew = _.pullAllBy(_.clone(alFound), alCurrent, "id");

        return {
            accountList: alFound,
            accountListNew: alNew,
            accountListDuplicate: alDuplicate,
            total: alRaw.length,
            totalUnique: alFound.length,
            totalNew: alNew.length,
            totalDuplicate: alDuplicate.length,
        };
    },
    getAlertList: (state, getters) => (option) => {
        const upRes = () => getters.getUploadResult()
        const importTypeAlert = () => {
            if (option === "REPLACE_ADD")
                return {
                    type: "warning",
                    icon: "mdi-swap-horizontal-bold",
                    message: `<b>${upRes().totalDuplicate}</b> 
                    existing/duplicate accounts will be replaced <br> <b>${upRes().totalNew}</b> 
                    new account(s) will be added`,
                };
            if (option === "REPLACE")
                return {
                    type: "warning",
                    icon: "mdi-swap-horizontal",
                    message: `<b>${upRes().totalDuplicate}</b> duplicate accounts will be replaced`,
                };
            else if (option === "ADD")
                return {
                    type: "success",
                    icon: "mdi-plus",
                    message: `<b>${upRes().totalNew}</b> new account(s) will be added`,
                };
            return null;
        };

        const res = [
            {
                type: upRes().total ? "info" : "error",
                icon: "mdi-magnify",
                message: `<b>${upRes().total}</b> accounts scanned from uploaded files`,
            },

            {
                type: upRes().totalUnique ? "info" : "error",
                icon: "mdi-counter",
                message: `<b>${upRes().totalUnique}</b> unique accounts found`,
            },

            {
                type: upRes().totalDuplicate ? "success" : "error",
                icon: "mdi-content-copy",
                message: `<b>${upRes().totalDuplicate}</b> existing/duplicate accounts found`,
            },

            {
                type: upRes().totalNew ? "info" : "error",
                icon: "mdi-new-box",
                message: `<b>${upRes().totalNew}</b> new accounts found`,
            },
            importTypeAlert(),
        ];

        return require('lodash').compact(res);
    },

    getModeList: (state, getters) => () => {
        const upRes = () => getters.getUploadResult()
        return [
            {
                value: "REPLACE",
                label:
                    "Replace existing/duplicate accounts ONLY (" +
                    upRes().totalDuplicate +
                    " accounts)",
                disabled: !upRes().totalDuplicate,
            },
            {
                value: "REPLACE_ADD",
                label:
                    "Replace ALL duplicates & add NEW ones (" +
                    upRes().totalUnique +
                    " accounts)",
                disabled: !upRes().totalDuplicate || !upRes().totalNew,
            },
            {
                value: "ADD",
                label:
                    "ONLY add new accounts (" +
                    upRes().totalNew +
                    " accounts)",
                disabled: !upRes().totalNew,
            },
        ];
    },

}

export const mutations = {
    SET_FILES_RAW(state, v) {
        state.filesRaw = v
    },
    SET_FILES(state, v) {
        state.files = v
    },
    REMOVE_FILE(state, name) {
        state.files = state.files.filter(f => f.name !== name)
    },
    CLEAR_FILES(state) {
        state.filesRaw = []
        state.files = []
    },
}
export const actions = {
    setFilesRaw({ commit }, v) {
        commit('SET_FILES_RAW', v)
    },
    setFiles({ commit }, v) {
        commit('SET_FILES', v)
    },
    removeFile({ commit }, name) {
        commit('REMOVE_FILE', name)
    },
    clearFiles({ commit }) {
        commit('CLEAR_FILES')
    }
}
