const { app, BrowserWindow } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setMenu(null);
  win.loadURL("https://www.bearlink.kr");


  win.webContents.setWindowOpenHandler(({ url }) => {
    require("electron").shell.openExternal(url);
    return { action: "deny" };
  });
}


function initAutoUpdater() {
  autoUpdater.on("checking-for-update", () => {
    console.log("업데이트 확인 중…");
  });
  autoUpdater.on("update-available", () => {
    console.log("새로운 업데이트가 있습니다!");
  });
  autoUpdater.on("update-not-available", () => {
    console.log("앱이 최신 버전입니다.");
  });
  autoUpdater.on("download-progress", (progress) => {
    console.log(`다운로드 중… ${progress.percent.toFixed(2)}%`);
  });
  autoUpdater.on("update-downloaded", () => {
    console.log("업데이트 다운로드 완료! 앱 재시작 시 적용됩니다.");
  });

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  createWindow();
  initAutoUpdater();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
