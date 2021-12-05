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
      const act = async () => {
        let result = { error: true, message: "Error occurred" };
        const callError = (message) => {
          // set error message
          mainCallback('The API returned an error: ' + message)
        }

        const callOk = (response) => {
          // set response
          mainCallback(null, response)
        }

        const mainCallback = (error = null, response) => {
          result = JSON.stringify({ error, response })
          // console.log(JSON.parse(result))
        }
        await oAuth2Client.getToken(authCode)
          .then(async (resToken) => {
            // const token = response.res.data
            oAuth2Client.setCredentials(resToken.tokens)
            // save the token
            // console.log(res)
            store.dispatch('settings/setGapiToken', resToken.tokens)
            // get user profile
            const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client })
            await oauth2.userinfo.v2.me.get().then(
              (resUserinfo) => {
                store.dispatch('settings/setGapiProfile', resUserinfo.data)
                callOk(resUserinfo.data)
              }
            ).catch(callError)
          })
          .catch(callError)

        return result
      }
      // eslint-disable-next-line node/no-callback-literal
      callback(await act())
    },
    async backupToDrive(ext, accList, callback) {

      const backupFile = $globals.getBackupAccountFile(
        ext,
        accList,
        false
      );

      const result = JSON.parse(
        await ipcRenderer.invoke(
          "api-gdrive-backup-to-drive",
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
