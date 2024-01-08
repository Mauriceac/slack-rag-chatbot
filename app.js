// This script has been adapted for use with LLMs running locally on LM Studio.

const { App } = require('@slack/bolt');
const { Groundx } = require('groundx-typescript-sdk');
const fetch = require('node-fetch');

require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

const groundx = new Groundx({
    apiKey: process.env.GROUNDX_API_KEY,
})

app.message(async ({ message, say }) => {
    
    try {
        // Send user's message to GroundX API
    console.log('Received message:', message.text);
    const queryString = message.text;

    const groundXResponse = await groundx.search.content({
        id: 7120,
        query: queryString,
        n: 5
    });

    llmText = groundXResponse.data.search.text
   

    // Send GroundX response to LLM API
    const messages = [
        {
            "role": "system",
            "content": `Use the data below to generate a response. Indicate the sources you've been given, if any. If the provided content is inadequate, answer 'I don't have sufficent information to answer the question'.
        ===
        ${llmText}
        ===
        `
        },
        { "role": "user", "content": queryString },
    ];
    
    
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: messages,
            temperature: 0.7,
            max_tokens: -1,
            stream: false
        })
    });
    
    const llmResponse = await response.json();
    
    // Send ChatGPT response back to the user in the Slack thread
    await say({
        thread_ts: message.ts,
        text: llmResponse.choices[0].message.content
    });
    } catch (error) {
        console.error(error);
    }
    
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();