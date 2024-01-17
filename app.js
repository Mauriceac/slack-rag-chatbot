const { App } = require('@slack/bolt');
const { Groundx } = require('groundx-typescript-sdk');
// const OpenAI = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

app.event('app_mention', async ({ event, context }) => {
    
    try {
        // Send user's message to GroundX API
    console.log('Received message:', event);
    const message = event.text.replace(/<@U[A-Z0-9]+>/, '');

    const groundXResponse = await groundx.search.content({
        id: 7120,
        query: message,
        //n: 5
    });

    llmText = groundXResponse.data.search.text
    
    // initiate Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Indicate model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    // Indicate prompt containing instructions, content to work with, and user message
    const prompt = `You're a cheerful chatbot for an online course. Greet the student using their ID: <@${event.user}>. Use the content provided below to generate a response to this student's message. Use emojis in your response. Indicate the sources you've been given, if any. If the provided content is inadequate to respond, answer 'I don't have enough information to answer your question.'.
    ===
    student message: ${message}
    ===
    Provided content: ${llmText}
    note: Challenge Course and Phase 1 are different names used to indicate the first part of the scholarship program.
    ===`;
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);

    // Send LLM response back to the user in the Slack thread
    
        await app.client.chat.postMessage({
            token: context.botToken,
            channel: event.channel,
            thread_ts: event.ts,
            text: text
        });

    } catch (error) {
        console.error(error);
    }
    
});

(async () => {
    await app.start(process.env.PORT || 3001);
    console.log('⚡️ Bolt app is running!');
})();