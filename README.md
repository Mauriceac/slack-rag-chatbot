# Slack chatbot with GroundX and ChatGPT

## Introduction
This is a retrieval-augmented generation (RAG) chatbot that can respond to messages in a Slack workspace channel. The chatbot sends the generated response within the message thread.

Content is stored within GroundX, a knowledge management platform that uses AI to help you find the right information at the right time. The chatbot uses the GroundX API to search for content and the OpenAI (ChatGPT) API to generate the chatbot's responses.

## Slack Bolt
We use Slack Bolt for Javascript to create the chatbot. 

We recommend going through the [Slack Bolt tutorial](https://slack.dev/bolt-js/tutorial/getting-started) to help you set up permissions, install the app in your workspace, install the SDK, and get acquainted with the code.


## GroundX API
Below is a basic example of the search endpoint we use in this chatbot. Before searching, you need to upload or ingest your content into GroundX. You can do this by using the GroundX UI or by using the GroundX SDK. Go to the [GroundX documentation](https://documentation.groundx.ai/docs/welcome) for more information.

### SDK
Install GroundX SDK:
```
npm install groundx-typescript-sdk
```
### API search endpoint

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

## ChatGPT
For this example, we are using the OpenAI API to generate responses. You can use any other API that generates text. Go to the [OpenAI documentation](https://platform.openai.com/docs/overview) for more information.

### Install
```bash
npm install --save openai
```	

### API completion endpoint
Example:
```js
const openai = require('openai');
const OpenAI = new openai({
    apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `Use the data below to generate a response. Indicate the sources you've been given, if any. If the provided content is inadequate, answer 'I don't have sufficent information to answer the question'.
            ===
            ${llmText}
            ===
            `
            },
            { "role": "user", "content": queryString },
        ],
    });

console.log(response.choices[0].message.content);



