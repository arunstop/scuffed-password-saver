import { ipcRenderer } from "electron"

export default ({ store }, inject) => {

    // appiconApi-get-urls-callback
    ipcRenderer.on('appiconApi-get-urls-callback', (event, payload) => {
        payload = JSON.parse(payload)
        store.dispatch('app/setIcon', payload)
    })

    inject('API_appicon', {
        getUrls() {
            ipcRenderer.send('appiconApi-get-urls', {
                appList: store.state.app.appList
            })
            // store.dispatch('app/setIcon', '')

        }
    })
}