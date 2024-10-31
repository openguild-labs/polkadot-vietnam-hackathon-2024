import OpenAI from 'openai';

async function OpenAIResponse(query: string, model: string, apiKey: string): Promise<string> {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: query }],
        model,
    });
    if (completion.choices && completion.choices[0].message.content) {
        return completion.choices[0].message.content;
    } else {
        throw new Error('Failed to get result from OpenAI');
    }
}
export { OpenAIResponse };