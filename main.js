'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

var mainWindow = null;
var loginWindow = null;

app.on('window-all-closed', function() {
	if(process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width:800, height:600});
	loginWindow = new BrowserWindow({width:300, height:300});
	// loginWindow.hide();

	const win = mainWindow.loadURL("file://"+__dirname+"/index.html");
	mainWindow.hide();

	loginWindow.loadURL("file://"+__dirname+"/login.html");
	loginWindow.on('closed', function() {
		loginWindow = null;
	});
	// loginWindow.setResizable(false);
	// var webContents = win.webContents;
	// mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	})
});

ipc.on("ChangePage", function(e) {
	mainWindow.loadURL("file://"+__dirname+"/login.html");
})
