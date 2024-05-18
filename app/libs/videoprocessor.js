import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { encode as base64Encode } from 'base64-stream'

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

// Function to convert an image file to base64
export function imageToBase64(imagePath) {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(imagePath)
		let base64String = ''

		const base64EncodeStream = base64Encode()
		base64EncodeStream.on('data', (chunk) => {
			base64String += chunk
		})

		base64EncodeStream.on('end', () => {
			resolve(base64String)
		})

		base64EncodeStream.on('error', (err) => {
			reject(err)
		})

		readStream.pipe(base64EncodeStream)
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

// Function to process video and extract frames at specified interval and audio
export async function processVideo(videoPath, secondsPerFrame = 2) {
	const base64Frames = []
	const baseVideoPath = path.parse(videoPath).name
	const outputFolder = 'frames'

	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder)
	}

	// Extract frames from the video
	const framePaths = await extractFrames(videoPath, secondsPerFrame, outputFolder)

	// Convert each frame to base64
	for (const framePath of framePaths) {
		const base64Frame = await imageToBase64(framePath)
		base64Frames.push(base64Frame)
	}

	// Extract audio from video
	const audioPath = `${baseVideoPath}.mp3`
	await extractAudio(videoPath, audioPath)

	console.log(`Extracted ${base64Frames.length} frames`)
	console.log(`Extracted audio to ${audioPath}`)
	return { base64Frames, audioPath }
}