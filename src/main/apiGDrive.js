const { shell, ipcMain } = require('electron');
const { google } = require('googleapis')
const API_CREDENTIALS = require('../renderer/assets/sps-gdrive-credentials.json')

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive'
const DRIVE_BACKUP_FOLDER_NAME = "Scuffed-Password-Saver_Backup"

// for web
// const cred = API_CREDENTIALS.web
// for desktop (current form)
const cred = API_CREDENTIALS.installed
const oAuth2Client = new google.auth.OAuth2(
    cred.client_id,
    cred.client_secret,
    cred.redirect_uris[0]
);

const getAuthCode = () => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    shell.openExternal(authUrl)
}

ipcMain.on('gapi-drive-backup', async (event, payload) => {

    // let result = { error: true, message: "Error occurred" };
    // payload = JSON.parse(payload)
    // console.log(payload)
    const token = payload.token
    oAuth2Client.setCredentials(token)
    const drive = google.drive({ version: 'v3', auth: oAuth2Client })

    const callError = (message) => {
        // set error message
        mainCallback('The API returned an error: ' + message)
    }

    const callOk = (response) => {
        // set response
        mainCallback(null, response)
    }

    const mainCallback = (error = null, response) => {
        event.reply(
            'gapi-drive-backup-callback',
            JSON.stringify({ error, response })
        )
        // console.log(JSON.parse(result))
    }

    const createBackupFolder = async (callback) => {
        const requestBody = {
            name: DRIVE_BACKUP_FOLDER_NAME,
            mimeType: 'application/vnd.google-apps.folder'
        }
        await drive.files.create({
            requestBody
        }).then(async res => {
            const folder = res
            console.log(folder.data.name + " has been created")
            // console.log(folder)
            // If folder created, then upload the backup file
            await uploadFile(folder.data.id, mainCallback)
            callOk(folder)
        }).catch(err => {
            console.error(err);
            callError(err)
        })
    }

    const uploadFile = async (parentFolderId, callback) => {
        // const accList = store.state.account.accountList
        const backupFile = payload.backupFile
        await drive.files.create({
            requestBody: {
                mimeType: backupFile.data.mimeType,
                parents: [parentFolderId],
                name: backupFile.name,
            },
            media: backupFile.data
        }).then(callOk).catch(callError)
    }

    await drive.files.list(
        { q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false", },
    ).then(async (res) => {
        // mainCallback(null)
        const fileList = res.data.files;
        const backupFolder = fileList.find(e => e.name === DRIVE_BACKUP_FOLDER_NAME)
        if (backupFolder) {
            // If there is backup folder then upload
            console.log(backupFolder.name + " is already created")
            await uploadFile(backupFolder.id, mainCallback)
        } else {
            // If there isn't create first and then upload
            await createBackupFolder(async (err, folder) => {
                if (err) {
                    // Handle error
                    console.error(err);
                    callError(err)
                } else {
                    console.log(folder.data.name + " has been created")
                    // console.log(folder)
                    // If folder created, then upload the backup file
                    await uploadFile(folder.data.id, mainCallback)
                }
            })
        }
    }).catch(callError)
})

ipcMain.on('gapi-drive-auth', async (event, payload) => {
    // change String payload into Object
    // console.log(payload)
    // payload = JSON.parse(payload)
    let gapiToken = ""
    let gapiProfile = ""
    const callError = (message) => {
        // set error message
        mainCallback('The API returned an error: ' + message)
    }

    const callOk = (response = '') => {
        // set response
        mainCallback(null, { token: gapiToken, profile: gapiProfile })
    }

    const mainCallback = (error = null, response) => {
        event.reply(
            'gapi-drive-auth-callback',
            JSON.stringify({ error, response })
        )
        // console.log(JSON.parse(result))
    }
    await oAuth2Client.getToken(payload.authCode)
        .then(async (resToken) => {
            // const token = response.res.data
            oAuth2Client.setCredentials(resToken.tokens)
            // save the token
            // console.log(res)
            gapiToken = resToken.tokens
            // get user profile
            const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client })
            await oauth2.userinfo.v2.me.get().then(
                (resUserinfo) => {
                    gapiProfile = resUserinfo.data
                    callOk(resUserinfo.statusText)
                }
            ).catch(callError)
        })
        .catch(callError)
})