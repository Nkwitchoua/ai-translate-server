import { translateClient } from '../clients/openaiClient.js';
import { PrismaClient } from '../generated/prisma/index.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { safeJson } from '../utils/safeJson.js';
import { limitService } from './limitService.js';

const prisma = new PrismaClient();

export const translateService = {
    translateText: async (textParams) => {
        // request
        // response
        // return response
        try {
            const translation = await translateClient.translateText(textParams.text, 'ru');

            console.log("after translation", translation);

            await limitService.decrementUserLimit(textParams.userId, "text", textParams.text.length);

            console.log("after decrement");

            return successResponse(translation, "Successfully translated");
        } catch(err) {
            console.log("Text translation error: ", err);
            return errorResponse("Не удалось перевести текст");
        }
    },
    translateImage: async (imageParams) => {
        // request
        // response
        // return response

        try {
            const translation = await translateClient.translateImage(imageParams.imageId, 'ru');

            console.log("after translation", translation);

            await limitService.decrementUserLimit(imageParams.userId, "photos", 100);

            console.log("after decrement");

            return successResponse(translation, "Successfully translated");
        } catch(err) {
            console.log("Text translation error: ", err);
            return errorResponse("Не удалось перевести текст");
        }
    },
    translateAudio: async (audioParams) => {
        try {
            const translation = await translateClient.translateAudio(audioParams.filePath, 'ru');

            console.log("after translation", translation);

            await limitService.decrementUserLimit(audioParams.userId, "audio", audioParams.duration);

            console.log("after decrement");

            return successResponse(translation, "Successfully translated");
        } catch(err) {
            console.log("Text translation error: ", err);
            return errorResponse("Не удалось перевести текст");
        }
    }
}
