import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

function cleanFramesFolder(folderPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(folderPath, (err, files) => {
			if (err) {
				return reject(err)
			}

			const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png' && /^frame-\d{3}\.png$/.test(file))

			const deletePromises = pngFiles.map(file => new Promise((res, rej) => {
				fs.unlink(path.join(folderPath, file), err => {
					if (err) {
						return rej(err)
					}
					res()
				})
			}))

			Promise.all(deletePromises)
				.then(() => resolve())
				.catch(reject)
		})
	})
}

export function extractFrames(videoPath, secondsPerFrame, outputFolder, scaleFactor = 0.5) {
	return new Promise((resolve, reject) => {
		const frameRate = 1 / secondsPerFrame
		const framePattern = path.join(outputFolder, 'frame-%03d.png')
		const resizeOptions = `fps=${frameRate},scale=iw*${scaleFactor}:ih*${scaleFactor}`

		ffmpeg(videoPath)
			.outputOptions([`-vf ${resizeOptions}`])
			.output(framePattern)
			.on('end', () => {
				fs.readdir(outputFolder, (err, files) => {
					if (err) {
						reject(err)
					} else {
						const framePaths = files.map(file => path.join(outputFolder, file))
						resolve(framePaths)
					}
				})
			})
			.on('error', reject)
			.run()
	})
}

export function imageToBase64(imagePath) {
	console.log(`imagePath: ${imagePath}`)
	return new Promise((resolve, reject) => {
		const fileName = path.basename(imagePath)
		const isPng = path.extname(fileName).toLowerCase() === '.png'
		const isValidPattern = /^frame-\d{3}\.png$/.test(fileName)

		if (!isPng || !isValidPattern) {
			const errorMsg = `Invalid file: ${fileName}. Only files matching the pattern frame-###.png are allowed.`
			console.error(errorMsg)
			reject(new Error(errorMsg))
			return
		}

		fs.readFile(imagePath, (err, data) => {
			if (err) {
				console.error(`Error reading file ${imagePath}:`, err)
				reject(err)
			} else {
				try {
					const base64String = data.toString('base64')
					resolve(base64String)
				} catch (conversionError) {
					console.error(`Error converting file ${imagePath} to base64:`, conversionError)
					reject(conversionError)
				}
			}
		})
	})
}

export function extractAudio(videoPath, audioPath) {
	return new Promise((resolve, reject) => {
		ffmpeg(videoPath)
			.output(audioPath)
			.audioBitrate('32k')
			.on('end', resolve)
			.on('error', reject)
			.run()
	})
}

export const outputFolder = 'frames'
export const outputAudioFolder = 'audio'

// Function to process video and extract frames at specified interval and audio
export async function processVideo(videoPath, secondsPerFrame = 4) {
	const base64Frames = []
	const baseVideoPath = path.parse(videoPath).name

	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder)
	}

	if (!fs.existsSync(outputAudioFolder)) {
		fs.mkdirSync(outputAudioFolder)
	}

	await cleanFramesFolder(outputFolder)

	const framePaths = await extractFrames(videoPath, secondsPerFrame, outputFolder)

	for (const framePath of framePaths) {
		const base64Frame = await imageToBase64(framePath)
		base64Frames.push(base64Frame)
	}

	const audioFilename = `${baseVideoPath}.mp3`
	const audioPath = path.join(outputAudioFolder, audioFilename)
	await extractAudio(videoPath, audioPath)

	console.log(`Extracted ${base64Frames.length} frames`)
	console.log(`Extracted audio to ${audioPath}`)
	return { base64Frames, audioFilename }
}