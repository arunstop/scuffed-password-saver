import { app } from 'electron'

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') { app.quit() }
})

const { BrowserWindow, ipcMain, shell } = require('electron')
const { download } = require('electron-dl')

ipcMain.on('download', async (event, { url, filename, directory }) => {
 	const win = BrowserWindow.getFocusedWindow()
 	//  console.log(url)
  await download(win, url, {
    filename, directory, openFolderWhenDone: true
  }).then((s) => {
    console.log('success')
    console.log(JSON.stringify(s))
    win.webContents.send('download-reply', JSON.stringify(s))
  }).catch((e) => {
    console.log('error')
    console.log(e)
  })
})

// api GDrive
require('./api/gapi')

require('./api/iconCrawlerApi')

// Load here all startup windows
require('./mainWindow')

