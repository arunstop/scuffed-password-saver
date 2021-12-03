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

ipcMain.handle('api-gdrive-backup-to-drive', async (event, strToken) => {
    let result = {error:true, message : "Error occurred"};
    console.log(strToken)
    oAuth2Client.setCredentials(JSON.parse(strToken))
    const drive = google.drive({ version: 'v3', auth: oAuth2Client })


    // const createBackupFolder = (callback) => {
    //     const requestBody = {
    //       name: DRIVE_BACKUP_FOLDER_NAME,
    //       mimeType: 'application/vnd.google-apps.folder'
    //     }
    //     drive.files.create({
    //       requestBody
    //     }, (err, folder) => {
    //       return callback(err, folder)
    //     })
    //   }

    //   const uploadFile = (parentFolderId, callback) => {
    //     // const accList = store.state.account.accountList
    //     const backupFile = $globals.getBackupAccountFile(ext, accList, false)
    //     drive.files.create({
    //       requestBody: {
    //         mimeType: backupFile.data.mimeType,
    //         parents: [parentFolderId],
    //         name: backupFile.name,
    //       },
    //       media: backupFile.data
    //     }, callback)
    //   }

    const response = await drive.files.list(
        { q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false", },
        // (err, res) => {
        //     if (err) { result = 'The API returned an error: ' + err; }
        //     const fileList = res.data.files;
        //     result = fileList
        //     const backupFolder = fileList.find(e => e.name === DRIVE_BACKUP_FOLDER_NAME)
        //     // if (backupFolder) {
        //     //   // If there is backup folder then upload
        //     //   console.log(backupFolder.name + " is already created")
        //     //   uploadFile(backupFolder.id, mainCallback)
        //     // } else {
        //     //   // If there isn't create first and then upload
        //     //   createBackupFolder((err, folder) => {
        //     //     if (err) {
        //     //       // Handle error
        //     //       console.error(err);
        //     //     } else {
        //     //       console.log(folder.data.name + " has been created")
        //     //       // console.log(folder)
        //     //       // If folder created, then upload the backup file
        //     //       uploadFile(folder.data.id, mainCallback)
        //     //     }
        //     //   })
        //     // }
        // }
    ).
    then(res=>{
        result = {
            error: false,
            message: res.statusText,
            data: res.data
        }
    })
    .catch(err => {
        // console.log(JSON.stringify(err.message))
        result = {
            error: true,
            message: err.message
        }
    })

    return JSON.stringify(result)
    // console.log(result)


    // if (result.status === 200) {
    //     return JSON.stringify({
    //         error: false,
    //         message: result.statusText,
    //         data: result.data
    //     })
    // } else {
    //     return JSON.stringify({
    //         error: true,
    //         message: result
    //     })
    // }
    // return "KEKL"
})