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

app.event('app_mention', async ({ event, context }) => {
    
    try {
        // Send user's message to GroundX API
        console.log('Received message:', event.text);
        const message = event.text.replace(/<@U[A-Z0-9]+>/, '');
    
        const groundXResponse = await groundx.search.content({
            id: 7120, //change this number with the id of the bucket or project you want to search through
            query: message,
            n: 5 //number of results to return, default is 20; ChatGPT has a limit of "tokens" per request, so we're limiting the number of results to 5 just in case.
        });
    
        llmText = groundXResponse.data.search.text
    
        // Send GroundX response to ChatGPT API
        const openAIResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                    {
                        "role": "system",
                        "content": `You're a helpful chatbot for an online course. Use the data below to generate a response. Indicate the sources you've been given, if any. If the provided content is inadequate to respond, answer 'I don't have enough information to answer your question.'.
                            ===
                            ${llmText}
                            ===
                            `
                    },
                    { 
                        "role": "user", 
                        "content": message 
                    },
            ],
        })
    
        // Send ChatGPT response back to the user in the Slack thread
            await app.client.chat.postMessage({
                token: context.botToken,
                channel: event.channel,
                thread_ts: event.ts,
                text: `Hi, <@${event.user}>! ` + openAIResponse.choices[0].message.content
            });  
    
    } catch (error) {
        console.error(error);
    }
    
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();