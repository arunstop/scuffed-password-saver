import { shell } from 'electron'
import _ from 'lodash'
import Vue2Storage from 'vue2-storage'
export default ({ app }, inject) => {
    inject('globals', {
        lodash: _,
        _,
        // Clone Vuex state
        cloneState: (stateVar) => {
            return JSON.parse(JSON.stringify(stateVar))
        },
        sortById: ({ arr, order = 'asc', prop = '', replacedWord = '' }) => {
            return arr.sort((currEl, nextEl) => {
                const getIdNo = (id) => id.replace(replacedWord, "");
                const currId = getIdNo(currEl?.[prop] || currEl)
                const nextId = getIdNo(nextEl?.[prop] || nextEl)
                if (order.toLowerCase() === 'desc') return nextId - currId;
                return currId - nextId;
            })
        },
        str: {
            compress: (str) => {
                return str.toLowerCase().trim()
            }
        },
        openUrl(url) {
            shell.openExternal(url)
        },
        openPath(path){
            shell.openPath(path)
            // shell.showItemInFolder(path)
        }
    })
}
