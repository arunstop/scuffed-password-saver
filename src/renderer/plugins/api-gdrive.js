/* eslint-disable camelcase */
export default ({ app, $globals, store }, inject) => {
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



  const cred = API_CREDENTIALS.web
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
    getToken: (authCode) => {
      oAuth2Client.getToken(authCode, (err, token) => {
        if (err) return console.log('Error retrieving token, try again')
        // if not error
        oAuth2Client.setCredentials(token)
        console.log(token)
        store.dispatch('settings/setDriveToken', token)
      })
    },
    getDriveFiles: () => {
      oAuth2Client.setCredentials(store.state.settings.driveToken)
      // const auth = oAuth2Client
      // get token from state drive key
      const drive = google.drive({ version: 'v3', auth: oAuth2Client })
      drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log('Files:');
          files.forEach((file) => {
            console.log(`${file.name} (${file.id})`);
          });
        } else {
          console.log('No files found.');
        }
      });
    },
    backupToDrive(ext, accList, mainCallback) {
      
      oAuth2Client.setCredentials(store.state.settings.driveToken)
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
        if (err) return alert('The API returned an error: ' + err);
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
