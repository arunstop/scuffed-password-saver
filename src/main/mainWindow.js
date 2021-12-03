import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  height: 600,
  width: 600,
  minHeight: 600,
  minWidth: 600,
  // titleBarStyle:'hidden',
  frame: false,

})

winHandler.onCreated((_browserWindow) => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
