const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production' || !app.isPackaged;
const DEV_PORT = process.env.PORT || 3000;
const DEV_URL = `http://localhost:${DEV_PORT}`;

let mainWindow;
let sidebarWindow;
let overlayWindow;

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: Math.min(900, width * 0.85),
    height: Math.min(640, height * 0.75),
    minWidth: 400,
    minHeight: 360,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
    title: 'Mochi Meadow',
  });
  mainWindow.loadURL(isDev ? `${DEV_URL}/` : `file://${path.join(__dirname, '../dist/index.html')}`);
  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  mainWindow.on('closed', () => { mainWindow = null; });
}

function createSidebarWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  sidebarWindow = new BrowserWindow({
    width: 48,
    height: height,
    x: width - 48,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  // Hash must match App.tsx getRoute() (e.g. #sidebar — not #/sidebar, or route falls through to main in a 48px strip)
  sidebarWindow.loadURL(
    isDev ? `${DEV_URL}/#sidebar` : `file://${path.join(__dirname, '../dist/index.html')}#sidebar`,
  );
  sidebarWindow.setAlwaysOnTop(true, 'floating');
  sidebarWindow.on('closed', () => { sidebarWindow = null; });
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  overlayWindow.loadURL(
    isDev ? `${DEV_URL}/#overlay` : `file://${path.join(__dirname, '../dist/index.html')}#overlay`,
  );
  overlayWindow.on('closed', () => { overlayWindow = null; });
}

app.whenReady().then(() => {
  createMainWindow();
  // Optional floating strip on the right (Study / Tasks). Off by default — it feels like an extra
  // sidebar on the desktop. Re-enable: createSidebarWindow();
  // createSidebarWindow();
  // Overlay (pet popup) can be created when we need to show a reminder
  // createOverlayWindow();
});

app.on('window-all-closed', () => app.quit());
