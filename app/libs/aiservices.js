import OpenAI from "openai";

const openai = new OpenAI({
	// eslint-disable-next-line no-undef
	apiKey: process.env.OPENAI_API_KEY
});

async function createVideoSummarization(frames, audioTranscription) {
	const frameObjects = frames.map(x => ({
		type: 'image_url',
		image_url: {
			url: `data:image/jpg;base64,${x}`,
			detail: 'low'
		}
	}));

	const response = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{
				role: "system",
				content: "You are generating a video summary. Please provide a summary of the video. Respond in Markdown."
			},
			{
				role: "user",
				content: [
					{ type: 'text', text: "These are the frames from the video." },
					...frameObjects,
					{ type: 'text', text: `The audio transcription is: ${audioTranscription}` }
				],
			},
		],
		temperature: 0,
	});

	console.log(response.choices[0].message.content);
	return response;
}

export { createVideoSummarization }