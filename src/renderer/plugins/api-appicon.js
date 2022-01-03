import { ipcRenderer } from "electron"

export default ({ store }, inject) => {

    
    // appiconApi-get-urls-callback
    ipcRenderer.on('appiconApi-get-urls-callback', (event, payload) => {
        payload = JSON.parse(payload)
        // store.dispatch('app/setIcon', payload)
        // console.log(payload)
        window.$nuxt.$emit("app-list-set-icon", payload);
    })

    inject('API_appicon', {
        getUrls(appList) {
           console.log(appList)
            ipcRenderer.send('appiconApi-get-urls', {
                appList
            })
            // store.dispatch('app/setIcon', '')

        }
    })
}