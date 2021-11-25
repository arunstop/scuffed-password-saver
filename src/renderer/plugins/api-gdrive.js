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
    const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly'



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
        init: ()=> getAuthCode(),
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
            const auth = oAuth2Client.setCredentials(store.state.settings.driveToken)
            // get token from state drive key
            const drive = google.drive({auth,version:'v3'})
            drive.files.list({
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
    })
}
