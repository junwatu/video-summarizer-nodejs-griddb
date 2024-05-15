# Building Video Summarizer Using AI

![blog-cover](images/cover.webp)

With the recent advancements in AI technology, such as OpenAI, it has become possible to automate tasks that were previously too tedious to perform manually. An example of this is a video summarizer. Previously, the process of summarizing video content relied mainly on human vision and hearing. However, with AI models such as [GPT-4](https://platform.openai.com/docs/models/gpt-4-turbo-and-gpt-4) and [Whisper](https://platform.openai.com/docs/models/whisper), it is now possible to automate this task.

We will be utilizing the following technologies: OpenAI, Node.js, React, and GridDB. This blog will teach you how to create a basic web application for uploading a video and receiving a summary of the content.

## Getting Started

These are the mandatory stack requirements that you need to run this project:

### OpenAI Key

To access any OpenAI services, you need a valid key. Go to this [link](https://platform.openai.com/api-keys) and create a new OpenAI key.

![setup key](images/openai-key.png)

The OpenAI key is on a project basis, so you need to create a project first in the OpenAI platform and you need also enable any models that you used on a project.

![enabled models](images/openai-enabled-models.png)

This key will be saved on `.env` file and make sure you don't include it in version control.

### Node.js

This project will run on Node.js platform. You need to install it from [here](https://nodejs.org/en/download).

To check the Node.js is working properly or not, you can use this command:

```shell
node --version
```

### GridDB

To save the video summarize and video data, we will use GridDB database. We will use Ubuntu here, please look the [guide](https://docs.griddb.net/latest/gettingstarted/using-apt/#install-with-apt-get) for installation.

## Run the Project
