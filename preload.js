const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
});


window.addEventListener('DOMContentLoaded', () => {
  const dragZone = document.createElement('div');
  dragZone.id = 'drag-zone';
  dragZone.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    -webkit-app-region: drag;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(dragZone);
});
