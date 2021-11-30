/* eslint-disable camelcase */
export default ({ app, $globals, $date, store }, inject) => {
  const readline = require('readline')
  const fs = require('fs')
  const { google } = require('googleapis')
  const API_CREDENTIALS = require('@/assets/sps-gdrive-credentials.json')


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
    $globals.window.openUrl(authUrl)
  }


  inject('API_gdrive', {
    init: () => getAuthCode(),
    authorizeAccess: (authCode, mainCallback) => {
      oAuth2Client.getToken(authCode, (err, token) => {
        // if error occurs
        if (err) {
          return mainCallback(err)
        }
        // if not error
        oAuth2Client.setCredentials(token)
        // save the token
        store.dispatch('settings/setDriveToken', token)
        // notify user
        mainCallback(err)
      })
    },
    backupToDrive(ext, accList, mainCallback) {

      const driveToken = store.state.settings.driveToken
      // if token has expired
      // and it has no refresh token
      if ($date.moment().format('x') > driveToken.expiry_date && !driveToken.refresh_token) {
        // alert('expired')
        // oAuth2Client.setCredentials(driveToken)
        return mainCallback(`Authorization access to your Google Drive account has expired. 
        Please redo authorization process.`)
      }
      oAuth2Client.setCredentials(driveToken)
      // console.log(oAuth2Client)
      const drive = google.drive({ version: 'v3', auth: oAuth2Client })

      const createBackupFolder = (callback) => {
        const requestBody = {
          name: DRIVE_BACKUP_FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder'
        }
        drive.files.create({
          requestBody
        }, (err, folder) => {
          return callback(err, folder)
        })
      }

      const uploadFile = (parentFolderId, callback) => {
        // const accList = store.state.account.accountList
        const backupFile = $globals.getBackupAccountFile(ext, accList, false)
        drive.files.create({
          requestBody: {
            mimeType: backupFile.data.mimeType,
            parents: [parentFolderId],
            name: backupFile.name,
          },
          media: backupFile.data
        }, callback)
      }

      drive.files.list({ q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false", }, (err, res) => {
        if (err) return mainCallback('The API returned an error: ' + err);
        const fileList = res.data.files;
        const backupFolder = fileList.find(e => e.name === DRIVE_BACKUP_FOLDER_NAME)
        if (backupFolder) {
          // If there is backup folder then upload
          console.log(backupFolder.name + " is already created")
          uploadFile(backupFolder.id, mainCallback)
        } else {
          // If there isn't create first and then upload
          createBackupFolder((err, folder) => {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              console.log(folder.data.name + " has been created")
              // console.log(folder)
              // If folder created, then upload the backup file
              uploadFile(folder.data.id, mainCallback)
            }
          })
        }
      })
    }
  })
}
