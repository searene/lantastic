import { app, BrowserWindow, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';
import {ZipReader} from './ZipReader';
import {Sqlite} from "./Sqlite";
import {Configuration} from "./Configuration";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  protocol.registerBufferProtocol('dictp',async (request, callback) => {
    const urlContents = request.url.substr(8).split(':');
    const resourceType = urlContents[0]; // image or audio
    const resourceHolderType = urlContents[1]; // zip
    const resourceHolderPath = urlContents[2];
    const resourceFileName = urlContents[3];
    if(resourceHolderType !== 'zip') {
      throw new Error(`${resourceHolderType} is not supported`);
    }
    const buffer = await ZipReader.extractFileFromZip(resourceHolderPath, resourceFileName);
    callback({
      mimeType: resourceType,
      data: buffer
    });
  });

  await Sqlite.init();
  await Configuration.init();
}


// zipReader.extractFileFromZip('/home/searene/Public/complete/En-En-Longman_DOCE5.dsl.dz.files.zip', 'exa_p008-001109504.wav');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// const template = [{
//   label: 'File',
//   submenu: [
//     {
//       label: 'Preferences',
//       click: () => {

//       }
//     }, {
//       type: 'separator' as 'separator'
//     }, {
//       role: 'quit'
//     }
//   ]
// }, {
//   label: 'View',
//   submenu: [
//     {
//       label: 'Toggle Developer Tools',
//       accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
//       click: (menuItem: MenuItem, browserWindow: BrowserWindow, event: Event) => {
//         browserWindow.webContents.toggleDevTools();
//       }
//     }
//   ]
// }];
// const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);
