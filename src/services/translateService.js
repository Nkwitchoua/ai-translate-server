import { translateClient } from '../clients/openaiClient.js';
import { PrismaClient } from '../generated/prisma/index.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { safeJson } from '../utils/safeJson.js';
import { checkUserTextLimit } from './limitService.js';

const prisma = new PrismaClient();

export const translateService = {
    translateText: async (textParams) => {
        // request
        // response
        // return response
        
    
        try {
            const translation = translateClient.translateText(textParams.text, 'ru');
            // changeTextLimit(userId, length);
            return successResponse(translation, "Successfully translated");
        } catch(err) {
            console.log("Text translation error: ", err);
            return errorResponse("Не удалось перевести текст");
        }
        
    },
    translateImage: async (img) => {
        // request
        // response
        // return response
    },
    translateAudio: async (audio) => {
        // request
        // response
        // return response
    }
}
