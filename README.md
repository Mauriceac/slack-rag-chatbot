# Slack chatbot with GroundX and LM Studio

## Introduction
This is a retrieval-augmented generation (RAG) chatbot that can respond to messages in a Slack workspace channel. The chatbot sends the generated response within the message thread.

Content is stored within GroundX, a knowledge management platform that uses AI to help you find the right information at the right time. The chatbot uses the GroundX API to search for content and the OpenAI (ChatGPT) API to generate the chatbot's responses.

## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Slack workspace](https://slack.com/get-started#/create)
- [GroundX account](https://www.groundx.ai/)
- [LM Studio](https://lmstudio.ai/)


## Setup
This setup lets you run the chatbot locally.

1. Clone this repository.
2. Install dependencies.
```bash
npm install
```
3. Create a `.env` file and add your API keys. Your `.env` file should look like this:
```
GROUNDX_API_KEY="<YOUR_GROUNDX_API_KEY>"

SLACK_BOT_TOKEN="<YOUR_SLACK_BOT_TOKEN>"
SLACK_SIGNING_SECRET="<YOUR_SLACK_SIGNING_SECRET>"
SLACK_APP_TOKEN="<YOUR_SLACK_APP_TOKEN>"
```

## Usage
After setting up the chatbot, you can run it locally and test it in your Slack workspace.

1. Run an LLM server using LM Studio.
2. Run the app from your terminal:
```bash
node app.js
```
1. Go to your Slack workspace.
2. Add the app to a channel.
3. Write a message and wait for the chatbot to respond within a couple of seconds.

## About the tools
Here's some extra information about the tools we used to create this chatbot.

### Slack Bolt
We use Slack Bolt for Javascript to create the chatbot. 

We recommend going through the [Slack Bolt tutorial](https://slack.dev/bolt-js/tutorial/getting-started) to help you set up permissions, install the app in your workspace, install the SDK, and get acquainted with the code.


### GroundX API
Below is a basic example of the search endpoint we use in this chatbot. Before searching, you need to upload or ingest your content into GroundX. You can do this by using the GroundX UI or by using the GroundX SDK. Go to the [GroundX documentation](https://documentation.groundx.ai/docs/welcome) for more information.

#### SDK
Install GroundX SDK:
```
npm install groundx-typescript-sdk
```
#### API search endpoint

Example:
```js
const { GroundX } = require('groundx-typescript-sdk');
const groundX = new GroundX({
    apikey: process.env.GROUNDX_API_KEY,
});

const result = await groundX.search.content({
    id: <BUCKET_ID>,
    query: <QUERYSTRING>,
    n: <NUMBER_OF_RESULTS>,
});

const llmText = result.data.search.text;
```

### LM Studio

1. Install [LM Studio](https://lmstudio.ai/) on your computer.
2. With LM Studio, download an LLM.
3. Using LM Studio, start the LLM server.