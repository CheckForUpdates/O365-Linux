const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
});

window.addEventListener('DOMContentLoaded', () => {
  // Determine app name from URL
  let appName = 'Office 365';
  try {
    const url = window.location.href;
    if (url.includes('word.office.com')) appName = 'Word';
    else if (url.includes('excel.office.com')) appName = 'Excel';
    else if (url.includes('powerpoint.office.com')) appName = 'PowerPoint';
    else if (url.includes('outlook.office.com')) appName = 'Outlook';
    else if (url.includes('onedrive.live.com')) appName = 'OneDrive';
    else if (url.includes('onenote.com')) appName = 'OneNote';
  } catch (e) {}

  const bar = document.createElement('div');
  bar.id = 'custom-title-bar';
  bar.innerHTML = `
    <style>
      #custom-title-bar {
        -webkit-app-region: drag;
        height: 32px;
        background: #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 9999;
        user-select: none;
      }
      #custom-title-bar .window-controls {
        display: flex;
        gap: 8px;
        -webkit-app-region: no-drag;
      }
      #custom-title-bar button {
        width: 32px; height: 24px;
        border: none; background: none;
        font-size: 16px; cursor: pointer;
        border-radius: 4px;
      }
      #custom-title-bar button:hover {
        background: #e0e0e0;
      }
    </style>
    <span>${appName}</span>
    <div class="window-controls">
      <button id="min-btn" title="Minimize">&#x2013;</button>
      <button id="max-btn" title="Maximize">&#x25A1;</button>
      <button id="close-btn" title="Close">&#x2715;</button>
    </div>
  `;
  document.body.prepend(bar);
  document.body.style.paddingTop = '44px'; // Increased padding

  document.getElementById('min-btn').onclick = () => window.electronAPI.minimize();
  document.getElementById('max-btn').onclick = () => window.electronAPI.maximize();
  document.getElementById('close-btn').onclick = () => window.electronAPI.close();
}); 