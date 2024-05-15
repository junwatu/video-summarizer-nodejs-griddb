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

### PUll the Source Code

To run the project, you need to clone the code from this [repository](https://github.com/junwatu/video-summarizer-nodejs-griddb).

Run this command to pull the source code.

```shell
git clone https://github.com/junwatu/video-summarizer-nodejs-griddb.git
```

Change directory to `app` folder and install any project dependencies using this command:

```shell
cd video-summarizer-nodejs-griddb
npm install
```

### Setup `.env`

This project needs a few environment variables. Copy the `env.example` file to `.env` file.

```shell
cp .env.example .env
```

You need to fill the environment variables in this file:

```ini
OPENAI_API_KEY=sk-....
APP_BASE_URL=http://localhost:3000
```

Everytime you change the `APP_BASE_URL` you need to rebuild the project also. Please run this command in `app` folder if you change that variable:

```shell
npm run rebuild
```

The command above will update the project to the new project url setting.

### Start the Project
