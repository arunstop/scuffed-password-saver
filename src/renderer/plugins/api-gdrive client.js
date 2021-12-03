
export default ({ app, $globals, $date, store }, inject) => {

  const gapi = require('gapi-client')
  console.log(gapi)

  inject('API_gdrive', {
    init: () => {
      function start() {
        // 2. Initialize the JavaScript client library.
        gapi.client.init({
          'apiKey': 'AIzaSyAiUu4CwZbbsAx7dhXLCM_LDk7mX9qIKi8',
          // Your API key will be automatically added to the Discovery Document URLs.
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          // clientId and scope are optional if auth is not required.
          'clientId': '659215805900-grrm389viv0lohbnllr02g9gqpk80mv6.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/drive',
        }).then(function () {
          // 3. Initialize and make the API request.
          console.log('YAY')
          alert('YYYY')
        }).then(function (response) {
          console.log(response.result);
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message);
        });
      };
      // 1. Load the JavaScript client library.
      gapi.load('client', start);
    }

  })
}
