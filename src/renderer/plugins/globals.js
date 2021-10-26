import { shell } from 'electron'
import _ from 'lodash'
import Vue2Storage from 'vue2-storage'
export default ({ app}, inject) => {
    
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
        openPath(path) {
            shell.openPath(path)
            // shell.showItemInFolder(path)
        },
        getPwDurability(lastEdited, freq) {
            
            const now = app.$date.moment();
            const edited = app.$date.moment(lastEdited);
            const dueDate = app.$date
                .moment(lastEdited)
                .add(freq, "months");
            const daysFull = dueDate.diff(edited, "days") - 1;
            const daysLeft = dueDate.diff(now, "days");
            const percentage = () => {
                if (daysLeft < 0) {
                    return 0;
                }
                return Math.round((daysLeft / daysFull) * 100) || 0;
            };
            const status = (v) => {
                if (v >= 70) {
                    return "success";
                } else if (v >= 40) {
                    return "warning";
                } else {
                    return "error";
                }
            };
            return {
                dueDate: dueDate.format("dddd, DD MMMM YYYY [at] HH:mm"),
                daysLeft,
                percentage: percentage(),
                status: status(percentage()),
            };
        }
    })
}
