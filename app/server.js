import path from 'path'
import { URL } from 'url'
import multer from 'multer'
import express from 'express'
import { fileURLToPath } from 'url'

const app = express()

// eslint-disable-next-line no-undef
const apiUrl = new URL(process.env.VITE_API_URL)
const hostname = apiUrl.hostname
const port = apiUrl.port || 3000

// Middleware to parse JSON bodies
app.use(express.json())

// Determine the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set up Multer storage configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, 'uploads'))
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		const name = path.basename(file.originalname, ext)
		cb(null, `${name}-${Date.now()}${ext}`)
	},
})

// Initialize Multer with the storage configuration
const upload = multer({ storage })

// Route: /upload
app.post('/upload', upload.single('video'), (req, res) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded')
	}
	res.send(`File uploaded: ${req.file.filename}`)
})

// Route: /summarize/:id
app.get('/summarize/:id', (req, res) => {
	const { id } = req.params
	res.send(`Summary for ID: ${id}`)
})

// Route: /videos
app.get('/videos', (req, res) => {
	res.send('List of videos')
})

// Route: /video/:id
app.get('/video/:id', (req, res) => {
	const { id } = req.params
	res.send(`Video details for ID: ${id}`)
})

app.listen(port, hostname, () => {
	// eslint-disable-next-line no-undef
	console.log(`Server is running on ${process.env.VITE_API_URL}`)
})