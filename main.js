'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

var loggedUser = null;

var mainWindow = null;
var loginHideWindow = null;

app.on('window-all-closed', function() {
	if(process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width:800, height:600, show:false});
	loginHideWindow = new BrowserWindow({width:800, height:600, show:false, "node-integration":false});
	mainWindow.loadURL("file://"+__dirname+"/index.html")
	// mainWindow.show();

	// loginWindow.hide();
	loginHideWindow.loadURL("https://mit-games.kr/wordpress/wp-login.php?action=electron&redirect_to=localhost");
	// "https://mit-games.kr/wordpress/wp-login.php"
	loginHideWindow.show();

	loginHideWindow.on('closed', function() {
		loginHideWindow = null;
	});

	loginHideWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
		event.preventDefault();

		if(newUrl.startsWith("https://mit-games.kr/wordpress/localhost")) {
			loginHideWindow.hide();

			mainWindow.loadURL("file://"+__dirname+"/index.html")
			mainWindow.show();

			loginHideWindow = null;
		}

		var dataArray = newUrl.split("localhost?")[1].split("&");
		for(const i in dataArray) {
			const value = dataArray[i].split("=")
			if(value[0] == "id") {
				loggedUser = value[1];
			}
		}

		console.log(loggedUser)
	});

	// loginWindow.setResizable(false);
	// var webContents = win.webContents;
	// mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	})
});

ipc.on("upload", function(event, args) {
	console.log(args);

	for(const i in args) {
		const file = args[i];
		console.log(file);
	}
});

ipc.on("sync-getId", function(event) {
	event.returnValue = loggedUser;
})
