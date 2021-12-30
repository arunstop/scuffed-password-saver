const Crawler = require('crawler');
const { ipcMain } = require('electron');

const webCrawler = new Crawler({
    maxConnections: 20,
    retries: 0,
})

const mainCallback = (event, name, url) => {
    event.reply('appiconApi-get-urls-callback',
        JSON.stringify({ name, url })
    )
}

const wcCallback = (error, res, done, event, payload) => {
    if (error) {
        console.log(error);
        mainCallback(event, payload.name, '')
    } else {
        const $ = res.$

        const shortcutIcon = $('head').find('link[rel="shortcut icon"]').attr('href')
        const icon = $('head').find('link[rel="icon"]').attr('href')
        const iconUrl = shortcutIcon || icon
        const uri = res.request.uri
        const url = uri.protocol + "//" + uri.hostname
        if (iconUrl) {
            const ext = "." + iconUrl.split('.').reverse()[0]

            // console.log(iconUrl)
            if (iconUrl.includes('http')) {
                console.log("WITH HTTP : ")
                console.log({ name: payload.name, url: iconUrl })
                mainCallback(event, payload.name, iconUrl )
            } else if (iconUrl.includes('//')) {
                console.log("WITH // : ")
                console.log({ name: payload.name, url: uri.protocol + iconUrl })
                mainCallback(event, payload.name, uri.protocol + iconUrl )
            }
            else {
                console.log("WITHOUT : ")
                console.log({ name: payload.name, url: uri.protocol + "//" + uri.hostname + iconUrl })
                mainCallback(event, payload.name, uri.protocol + "//" + uri.hostname + iconUrl )
            }
        } else {
            mainCallback(event, payload.name, url + "/favicon.ico" )
        }
    }
    done();
}


ipcMain.on('appiconApi-get-urls', (event, payload) => {
    console.log(payload)
    // payload = JSON.parse(payload)
    webCrawler.queue(payload.appList.map((app) => {
        const iconUrl = "https://" + app.urls[0] + "/favicon.ico"
        // console.log(app.urls[0])
        return {
            uri: "https://" + app.urls[0],
            callback: (error, res, done) => wcCallback(error, res, done, event, {
                name: app.name,
                url: iconUrl
            }
            )
        }
    }))
})

