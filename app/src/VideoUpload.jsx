import axios from 'axios'
import { useState } from 'react'
import { Box, Heading, Badge, Text } from '@radix-ui/themes'

const VideoUpload = () => {
	const [file, setFile] = useState(null)
	const [uploadStatus, setUploadStatus] = useState('')
	const [frameCount, setFrameCount] = useState(0)
	const [audioPath, setAudioPath] = useState('')

	const handleFileChange = (e) => {
		setFile(e.target.files[0])
	}

	const handleUpload = async (e) => {
		e.preventDefault()
		if (!file) {
			setUploadStatus('Please select a file to upload.')
			return
		}

		const formData = new FormData()
		formData.append('video', file)

		try {
			setUploadStatus('Uploading...')
			const response = await axios.post('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			setUploadStatus('Upload successful!')
			setFrameCount(response.data.frames.length)
			setAudioPath(response.data.audio)
		} catch (error) {
			console.error('Error uploading file:', error)
			setUploadStatus('Upload failed.')
		}
	}

	return (
		<Box>
			<Heading>AI Video Summarizer</Heading>
			<form onSubmit={handleUpload}>
				<input type="file" accept="video/*" onChange={handleFileChange} />
				<button type="submit">Upload</button>
			</form>
			<Badge>{uploadStatus}</Badge>
			{frameCount > 0 && (
				<div>
					<Badge>Number of Extracted Frames: {frameCount}</Badge>
				</div>
			)}
			{audioPath && (
				<div>
					<Badge>
						<a href={audioPath} download>
							Download Extracted Audio
						</a>
					</Badge>
				</div>
			)}
		</Box>
	)
}

export default VideoUpload