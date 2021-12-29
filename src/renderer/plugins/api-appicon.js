import { ipcRenderer } from "electron"

export default ({ store }, inject) => {
    inject('API_appicon', {
        getUrls() {
            // alert(store.state.app.appList)
            ipcRenderer.once('appiconApi-get-urls-callback', (event, payload) => {
                payload = JSON.parse(payload)
                store.dispatch('app/setIcon', payload)
            })
            ipcRenderer.send('appiconApi-get-urls', {
                appList: store.state.app.appList.filter(e=>e.urls.length && !e.icon)
            })
                // store.dispatch('app/setIcon', '')

        }
    })
}