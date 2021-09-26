const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

// contextBridge.exposeInMainWorld("api", {
//   saveDataFile: x => ipcRenderer.invoke("saveDataFile", x)
// });

let validListenChannels = ["app_version", "update_available", "update_downloaded"];
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["app_version", "restart_app"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    if (validListenChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  off: (channel) => {
    if (validListenChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },
});
