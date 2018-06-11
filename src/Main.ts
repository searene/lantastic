import { app, BrowserWindow, protocol, ipcMain, clipboard, Menu } from "electron";
import * as fse from "fs-extra";
import * as path from "path";
import * as url from "url";
import { ZipReader } from "./ZipReader";
import MimeTypedBuffer = Electron.MimeTypedBuffer;
import RegisterBufferProtocolRequest = Electron.RegisterBufferProtocolRequest;
import { IImageSearchWebViewData } from "./components/ImageSearchModal";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  protocol.registerBufferProtocol("dictp", async (request, callback) => {
    const urlContents = request.url.substr(8).split(":");
    const type = urlContents[0]; // image/audio/lookup
    if (type === "image" || type === "audio") {
      await loadResources(request, callback);
    } else if (type === "lookup") {
    }
  });
}

const loadResources = async (
  request: RegisterBufferProtocolRequest,
  callback: (buffer?: Buffer | MimeTypedBuffer) => void
) => {
  const urlContents = request.url.substr(8).split(":");
  const resourceType = urlContents[0]; // image/audio/lookup
  const resourceHolderType = urlContents[1]; // zip
  const resourceHolderPath = urlContents[2];
  const resourceFileName = urlContents[3];
  if (resourceHolderType !== "zip") {
    throw new Error(`${resourceHolderType} is not supported`);
  }
  const buffer = await ZipReader.extractFileFromZip(resourceHolderPath, resourceFileName);
  callback({
    data: buffer,
    mimeType: resourceType
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on("webview-context-link", (event: Event, data: IImageSearchWebViewData) => {
  console.log("blah");
  const menu = Menu.buildFromTemplate([{
    label: "Copy Image Address",
    click: () => {
      clipboard.writeText(data.src);
    }
  }]);
  menu.popup({});
})

// for hot reload
// TODO remove it in production
fse.watch(path.join(__dirname), (event, fileName) => {
  win.webContents.reloadIgnoringCache();
});
