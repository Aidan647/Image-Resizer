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
import fs from "fs/promises"
import electron from "electron"
let EventIndex = 0
console.log(fs)
const sendEvent = async (channel: string, data: any) => {
	return new Promise<{ error?: string; data: any }>((resolve, reject) => {
		try {
			electron.ipcRenderer.once(channel + "Result" + EventIndex, (event, args) => {
				resolve(args)
			})
			electron.ipcRenderer.send(channel, { index: EventIndex++, data })
		} catch (e) {
			reject(e)
		}
	})
}

const getFiles = async (files: string[]) => {
	return new Promise<string[]>(async (resolve, reject) => {
		try {
			const promises: Promise<string[]>[] = []
			files.forEach((element) => {
				promises.push(
					new Promise<string[]>(async (resolve, reject) => {
						const result: string[] = []
						if (await (await fs.lstat(element)).isDirectory()) {
							result.push(...(await getFiles(await fs.readdir(element))))
						}
						resolve(result)
					})
				)
			})
			const data = await Promise.all(promises)
			console.log(data)
		} catch (e) {
			reject(e)
		}
	})
}

document.getElementById("createFile").addEventListener("click", async () => {
	const { data, error }: { data: string[]; error?: string } = await sendEvent("open", {
		properties: ["openFile", "openDirectory", "multiSelections"],
	})
	if (error == "canceled") return
	if (error) {
		console.error(error)
		return
	}
	getFiles(data)
	console.log(data)
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
