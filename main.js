const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function getIconForUrl(url) {
  if (url.includes('word.office.com')) return path.join(__dirname, 'icons', 'word.svg');
  if (url.includes('excel.office.com')) return path.join(__dirname, 'icons', 'excel.svg');
  if (url.includes('powerpoint.office.com')) return path.join(__dirname, 'icons', 'powerpoint.svg');
  if (url.includes('outlook.office.com')) return path.join(__dirname, 'icons', 'outlook.svg');
  if (url.includes('onedrive.live.com')) return path.join(__dirname, 'icons', 'onedrive.svg');
  if (url.includes('onenote.com')) return path.join(__dirname, 'icons', 'onenote.svg');
  return path.join(__dirname, 'icons', 'word.svg'); // Default icon
}

function getPreloadPath() {
  return path.join(__dirname, 'preload.js');
}

function createWindow(urlOverride) {
  // Get the Office app URL from command line args
  const officeUrl = urlOverride || process.argv[2] || 'https://www.office.com/';
  const iconPath = getIconForUrl(officeUrl);

  const win = new BrowserWindow({
    width: 1400, // Slightly larger initial size
    height: 900,
    frame: false, // Frameless
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: getPreloadPath(),
    },
    icon: iconPath,
    title: 'Office 365',
  });

  win.loadURL(officeUrl);

  // Resize window to fit the document after the page loads
  win.webContents.on('did-finish-load', async () => {
    try {
      const { width, height } = await win.webContents.executeJavaScript(`
        ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        })
      `);
      // Add extra height for toolbars, etc.
      win.setSize(Math.max(width, 1200), Math.max(height + 100, 900));
    } catch (e) {
      // Fallback: do nothing if script fails
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 1400,
        height: 900,
        frame: false,
        icon: getIconForUrl(url),
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: getPreloadPath(),
        },
      }
    };
  });

  // IPC handlers for window controls
  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on('window-close', () => win.close());
}

app.whenReady().then(() => createWindow());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
}); 