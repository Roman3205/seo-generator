import OpenAI from 'openai';

const {aiApi} = useRuntimeConfig()

export const openai = new OpenAI({
    apiKey: aiApi
})