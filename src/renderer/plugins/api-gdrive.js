import { ipcRenderer } from 'electron'

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
  const SCOPES = `https://www.googleapis.com/auth/drive
  https://www.googleapis.com/auth/userinfo.profile 
  https://www.googleapis.com/auth/userinfo.email`.replaceAll("\n", "")
  const DRIVE_BACKUP_FOLDER_NAME = "Scuffed-Password-Saver_Backup"

  // filter 
  // const filter = {
  //   urls: ['https://www.googleapis.com/drive/v3/*']
  // };
  // const session = require('electron').remote.session
  // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   // details.requestHeaders.Origin = null;
  //   // details.headers.Origin = null;
  //   // alert('CALLING')
  //   console.log(details)
  //   const cbParam = { requestHeaders: { ...details.requestHeaders, Origin: '*' } }
  //   callback(cbParam)
  // });

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   const cbParam = {
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Access-Control-Allow-Origin': ['*'],
  //     },
  //   }
  //   callback(cbParam);
  // });


  // for web
  // const cred = API_CREDENTIALS.web
  // for desktop (current form)
  const cred = API_CREDENTIALS.installed
  const oAuth2Client = new google.auth.OAuth2(
    cred.client_id,
    cred.client_secret,
    cred.redirect_uris[0]
  );

  // oAuth2Client.setCredentials(store.state.settings.driveToken)
  // console.log(oAuth2Client)
  // const oauth2 = google.oauth2({version:"v2", auth:oAuth2Client})
  // oauth2.userinfo.v2.me.get(
  //   (err,res)=>{
  //     if(err) {return console.log(err)}
  //     console.log(res)
  //   }
  // )

  const getAuthCode = () => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    $globals.window.openUrl(authUrl)
  }


  inject('API_gdrive', {
    init: () => getAuthCode(),
    authorizeAccess: async (authCode, callback) => {
      // callbackof Electron's API
      ipcRenderer.on('gapi-drive-auth-callback',(event,payload)=>{
        payload = JSON.parse(payload)
        if(payload.error){
          return callback(payload.error)
        }
        const resp = payload.response
        store.dispatch('settings/setGapiToken', resp.token)
        store.dispatch('settings/setGapiProfile', resp.profile)
        callback()
      })
      // authenticate via Electron's API
      ipcRenderer.send('gapi-drive-auth', {authCode})
    },
    backupToDrive: async (ext, accList, callback) => {

      const backupFile = $globals.getBackupAccountFile(
        ext,
        accList,
        false
      );

      const result = JSON.parse(
        await ipcRenderer.invoke(
          "gapi-drive-backup",
          JSON.stringify({
            token: store.state.settings.gapiToken,
            backupFile,
          })
        )
      );
      // console.log(result);
      callback(result)
    },

    async getEmail() {
      oAuth2Client.setCredentials(store.state.settings.gapiToken)
      console.log(store.state.settings.gapiToken)
      const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client })
      oauth2.userinfo.v2.me.get(
        (err, profile) => {
          if (err) { return console.log(err) }
          store.dispatch('settings/setGapiProfile', profile)
        }
      )
    }
  })
}
