import axios from 'axios'
import { useState } from 'react'

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
		<div>
			<h1>Upload Video</h1>
			<form onSubmit={handleUpload}>
				<input type="file" accept="video/*" onChange={handleFileChange} />
				<button type="submit">Upload</button>
			</form>
			<p>{uploadStatus}</p>
			{frameCount > 0 && (
				<div>
					<h2>Number of Extracted Frames: {frameCount}</h2>
				</div>
			)}
			{audioPath && (
				<div>
					<h2>Extracted Audio</h2>
					<audio controls>
						<source src={audioPath} type="audio/mp3" />
						Your browser does not support the audio element.
					</audio>
				</div>
			)}
		</div>
	)
}

export default VideoUpload