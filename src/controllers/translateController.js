import { checkUserTextLimit } from '../services/limitService.js';
import { translateService } from '../services/translateService.js';
import { errorResponse } from '../utils/response.js';
import { safeJson } from '../utils/safeJson.js';

// req.body = {
//     userId: "1111",
//     content: "",
//     type: "text/audio/photo"
// }

export const translateText = async (req, res) => {
    const userId = req.user.id;
    const length = req.body?.text?.length;

    console.log(req.body);

    if(!length) res.json(errorResponse("Пустой инпут"));
    
    const checkLimit = checkUserTextLimit(userId, length);
    if(!checkLimit) {
        return errorResponse("Закончился лимит на сообщения")
    };
    
    const result = await translateService.translateText({ text: req.body.text });

    return result;
}

export const translateImage = async (req, res) => {
    // const checkTextLimit = 
}

export const translateAudio = async (req, res) => {
    // const checkTextLimit = 
}