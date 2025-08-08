import OpenAI from "openai";
import fs from "fs";

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
                You are a professional translator.
                The user's input may be in Chinese, English, or any language.
                Translate it to ${lang} as accurately as possible.
                Preserve slang, insults, or profanity exactly as they are.
                Do not censor or paraphrase. Return only the translation.
                `.trim()
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

      const result = response.choices[0].message.content;
      return result;

    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        console.log(err.request_id);
        console.log(err.status);
        console.log(err.name);
        console.log(err.headers);
      } else {
        throw new Error(err);
      }
    }
  },
  translateAudio: async (audio, lang) => {
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(audio),
      model: AUDIO_MODEL,
      response_format: "text"
    });

    console.log("transcription ", transcription);

    const translation = await translateClient.translateText(transcription, 'russian');
    console.log("GPT Translation:", translation);

    return translation;
  },
  translateImage: async (imageId, lang) => {
    const transcription = await client.responses.create({
      model: IMAGE_MODEL,
      input: [
        {
          role: "system",
          content: "Extract **all** text from the image exactly as it appears, including multiple labels or regions. No descriptions, no explanations, no translation — only raw text."
        },
        {
          role: "user",
          content: [
            {
              type: "input_image",
              file_id: imageId,
            },
          ],
        },
      ],
    });

    console.log(transcription);

    const translation = await translateClient.translateText(transcription.output_text, "russian");
    console.log(translation);

    return translation;
  }
};
