const Crawler = require('crawler');
const { ipcMain } = require('electron');

const webCrawler = new Crawler({
    maxConnections: 20,
    retries: 2,
})

const wcCallback = (error, res, done, event, payload) => {
    if (error) {
        console.log(error);
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
                return event.reply('appiconApi-get-urls-callback',
                    JSON.stringify({ name: payload.name, url: iconUrl })
                )
            } else if (iconUrl.includes('//')) {
                console.log("WITH // : ")
                console.log({ name: payload.name, url: uri.protocol + iconUrl })
                return event.reply('appiconApi-get-urls-callback',
                    JSON.stringify({ name: payload.name, url: uri.protocol + iconUrl })
                )
            }
            else {
                console.log("WITHOUT : ")
                console.log({ name: payload.name, url: uri.protocol + "//" + uri.hostname + iconUrl })
                return event.reply('appiconApi-get-urls-callback',
                    JSON.stringify({ name: payload.name, url: uri.protocol + "//" + uri.hostname + iconUrl })
                )
            }
        } else {
            return event.reply('appiconApi-get-urls-callback',
                JSON.stringify({ name: payload.name, url: url +"/favicon.ico" })
            )
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

