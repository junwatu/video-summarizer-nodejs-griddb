import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

// Function to extract frames using ffmpeg
export function extractFrames(videoPath, secondsPerFrame, outputFolder) {
	return new Promise((resolve, reject) => {
		const frameRate = 1 / secondsPerFrame
		const framePattern = path.join(outputFolder, 'frame-%03d.png')

		ffmpeg(videoPath)
			.outputOptions([`-vf fps=${frameRate}`])
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

// Function to convert an image file to base64 using Buffer
export function imageToBase64(imagePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(imagePath, (err, data) => {
			if (err) {
				reject(err)
			} else {
				const base64String = data.toString('base64')
				resolve(base64String)
			}
		})
	})
}

// Function to extract audio from video
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

export const outputFolder = "frames"
export const outputAudioFolder = "audio"

// Function to process video and extract frames at specified interval and audio
export async function processVideo(videoPath, secondsPerFrame = 2) {
	const base64Frames = []
	const baseVideoPath = path.parse(videoPath).name

	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder)
	}

	if (!fs.existsSync(outputAudioFolder)) {
		fs.mkdirSync(outputAudioFolder)
	}

	// Extract frames from the video
	const framePaths = await extractFrames(videoPath, secondsPerFrame, outputFolder)

	// Convert each frame to base64
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