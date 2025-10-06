const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveLog: (name, data) => ipcRenderer.invoke('save-log', { name, data }),
  loadLog: () => ipcRenderer.invoke('load-log')
});
