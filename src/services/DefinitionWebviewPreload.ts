import { ipcRenderer } from "electron";

ipcRenderer.on("load-html", (event: Electron.Event, html: string) => {
  document.body.scrollTop = 0;
  document.body.innerHTML = html;
});