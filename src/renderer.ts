/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css"
// import fs from "fs"
import electron from "electron"

const sendEvent = async (channel: string, ...args: any[]) => {
	return new Promise((resolve, reject) => {
		try {
			electron.ipcRenderer.once(channel + "Result", (event, args) => {
				const { data, error } = args
				if (error) return reject(error)
				resolve(data)
			})
			electron.ipcRenderer.send(channel, ...args)
		} catch (e) {
			reject(e)
		}
	})
}

document.getElementById("createFile").addEventListener("click", async () => {
	const result = await sendEvent("open", {
		properties: ["openFile", "openDirectory", "multiSelections"],
	})
	console.log(result)
	// try {
	// 	const { canceled, filePaths } = await dialog.showOpenDialog({
	// 		properties: ["openFile", "openDirectory"],
	// 	})
	// 	if (canceled) return
	// 	console.log(filePaths)
	// } catch (e) {
	// 	console.error(e)
	// }
	// .then((result) => {
	// 	console.log(result.canceled)
	// 	console.log(result.filePaths)
	// })
	// .catch((err) => {
	// 	console.log(err)
	// })
	// fs.writeFileSync("file.txt", "utf8")
})
