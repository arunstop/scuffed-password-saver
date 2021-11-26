import { shell, remote } from 'electron'
import _ from 'lodash'
import { nanoid } from 'nanoid'
export default ({ app,$date }, inject) => {
  const renderer = require('electron').ipcRenderer
  const window = remote.getCurrentWindow()

  const jsonToTxt = (data) => require('json-to-txt')({ data })
  const jsonToCsv = (data) => require('papaparse').unparse(data, { quotes: true })

  inject('globals', {
    lodash: _,
    _,
    // Clone Vuex state
    cloneState: (stateVar) => {
      return JSON.parse(JSON.stringify(stateVar))
    },
    sortById: ({ arr, order = 'asc', prop = '', replacedWord = '' }) => {
      return arr.sort((currEl, nextEl) => {
        const getIdNo = id => id.replace(replacedWord, '')
        const currId = getIdNo(currEl?.[prop] || currEl)
        const nextId = getIdNo(nextEl?.[prop] || nextEl)
        if (order.toLowerCase() === 'desc') { return nextId - currId }
        return currId - nextId
      })
    },
    str: {
      compress: (str) => {
        return str.toLowerCase().trim()
      },
      generateId: () => nanoid().replaceAll('-', '0')
    },
    window: {
      openUrl(url) {
        shell.openExternal(url)
      },
      openPath(path) {
        shell.openPath(path)
        // shell.showItemInFolder(path)
      },
      minimize() {
        window.minimize()
      },
      maximize() {
        window.maximize()
      },
      unmaximize() {
        window.unmaximize()
      },
      close() {
        window.close()
      }
    },
    getAppPath() {
      const path = remote.app.getAppPath('documents')
        .split('\\')
        .slice(0, -2)
        .toString()
        .replaceAll(",", '\\')
      return path
    },
    getBackupAccountFile(ext, accList, url = true) {
      // ex. output : sps_backup_2021-11-26@23-11-36
      const name = `sps_backup_${$date.moment().format("YYYY-MM-DD@HH-mm-ss")}${ext}`
      let data; let mimeType; let body = null
      if (ext === '.json') {
        mimeType = "text/json"
        body = JSON.stringify(accList)
        // if url return string
        if (url) data = `data:${mimeType};charset=utf-8,` + encodeURIComponent(body)
        // if not url return object
        else data = { mimeType, body }
      } else if (ext === '.txt') {
        mimeType = "text/plain"
        body = jsonToTxt(accList)
        // if url return string
        if (url) data = `data:${mimeType};charset=utf-8,` + encodeURIComponent(body)
        else data = { mimeType, body }
        // if not url return object
      } else if (ext === '.csv') {
        mimeType = "text/csv"
        body = jsonToCsv(accList)
        // if url return string
        if (url) data = `data:${mimeType};charset=utf-8,` + encodeURIComponent(body)
        else data = { mimeType, body }
      }
      return { name, data }
    },
    jsonToTxt,
    txtToJson(filePath) {
      return require('txt-file-to-json')({ filePath })
    },
    jsonToCsv,
    async csvToJson(files, funk) {
      return await new Promise((resolve) => {
        require('papaparse').parse(files, {
          header: true,
          complete: (results) => {
            // console.log('Complete', results.data.length, 'records.');
            resolve(results.data)
          }
        })
      })
    },
    download({ url, filename, directory, successAction }) {
      renderer.once('download-reply', (event, arg) => {
        // arg = JSON.parse(arg)
        successAction(arg)
        // renderer.removeAllListeners()
        // console.log(arg); // prints "pong"
        // this.$globals.openPath(arg.savePath)
      })
      renderer.send(
        'download',
        {
          url,
          filename,
          directory
        }
      )
    },
    getPwDurability(lastEdited, freq) {
      const now = app.$date.moment()
      const edited = app.$date.moment(lastEdited)
      const dueDate = app.$date
        .moment(lastEdited)
        .add(freq, 'months')
      const daysFull = dueDate.diff(edited, 'days') - 1
      const daysLeft = dueDate.diff(now, 'days')
      const percentage = () => {
        if (daysLeft < 0) {
          return 0
        }
        return Math.round((daysLeft / daysFull) * 100) || 0
      }
      const status = (v) => {
        if (v >= 70) {
          return 'success'
        } else if (v >= 40) {
          return 'warning'
        } else {
          return 'error'
        }
      }
      return {
        dueDate: dueDate.format('dddd, DD MMMM YYYY [at] HH:mm'),
        daysLeft,
        percentage: percentage(),
        status: status(percentage())
      }
    }
  })
}
