// src/App.js
import { Card, Box } from '@radix-ui/themes'
import VideoUpload from './VideoUpload'

const App = () => {
	return (
		<Box p="5px" maxWidth="400px">
			<Card>
				<VideoUpload />
			</Card>
		</Box>
	)
}

export default App