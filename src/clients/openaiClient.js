import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TEXT_MODEL = process.env.TEXT_MODEL, 
AUDIO_MODEL = process.env.AUDIO_MODEL, 
IMAGE_MODEL = process.env.IMAGE_MODEL;

export const translateClient = {
  translateText: async (text, lang) => {
    try {
      const response = await client.chat.completions.create({
        model: TEXT_MODEL,
        messages: [
          {
                role: "system",
                content: `
                You are a professional translator. Translate the user's input to ${lang} **as accurately as possible**.
                Keep the tone, slang, offensive words, or profanity **exactly as they are**.
                Do **not** censor, soften, or paraphrase — return a raw translation of the actual meaning and wording.
                `.trim(),
            },
          {
            role: "user",
            content: text,
          },
        ],
      });

      const result = response.choices[0].message.content;
      console.log("GPT Translation:", result);
      return result;
    } catch (err) {
      console.error("OpenAI error:", err);
      throw err; // можно вернуть fallback или пустую строку
    }
  },
};
