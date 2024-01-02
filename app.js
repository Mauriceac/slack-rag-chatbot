const { App } = require('@slack/bolt');
const { Groundx } = require('groundx-typescript-sdk');
const OpenAI = require('openai');

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
const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
});

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

    // Send GroundX response to ChatGPT API
    const openAIResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
                {
                        "role": "system",
                        "content": `You are a chatbot for an online course. Use the data below to generate a response. Indicate the sources you've been given, if any. If the provided content is inadequate, answer 'Can you please provide more context?'.
                ===
                ${llmText}
                ===
                `
                },
                { "role": "user", "content": queryString },
        ],
    })

    // Send ChatGPT response back to the user in the Slack thread
    await say({
        thread_ts: message.ts,
        text: openAIResponse.choices[0].message.content
    });
    } catch (error) {
        console.error(error);
    }
    
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();