import path from 'path'
import { URL } from 'url'
import multer from 'multer'
import express from 'express'
import { fileURLToPath } from 'url'
// eslint-disable-next-line no-unused-vars
import { processVideo } from './videoprocessor.js'


const app = express()

// eslint-disable-next-line no-undef
const apiUrl = new URL(process.env.VITE_API_URL)
const hostname = apiUrl.hostname
const port = apiUrl.port || 3000

// Determine the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

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

const upload = multer({ storage })

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.post('/upload', upload.single('video'), (req, res) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded')
	}
	res.send(`File uploaded: ${req.file.filename}`)
})

app.get('/summarize/:id', (req, res) => {
	const { id } = req.params
	res.send(`Summary for ID: ${id}`)
})

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
