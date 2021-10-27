import { app } from 'electron'

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

const {BrowserWindow, ipcMain} = require('electron');
const {download} = require('electron-dl');

ipcMain.on('download-button', async (event, url) => {
 	const win = BrowserWindow.getFocusedWindow();
 	 console.log(url)
   await download(win, url).then(s=>{
      console.log('success')
      console.log(s.getSavePath())
    }).catch(e=>{ 
      console.log('error')
      console.log(e)
    })
});

ipcMain.on('test123', (event, arg) => {
  console.log(arg) // prints "ping"
})

// Load here all startup windows
require('./mainWindow')
