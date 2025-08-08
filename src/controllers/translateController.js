import path from 'path';
import { limitService } from '../services/limitService.js';
import { translateService } from '../services/translateService.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { safeJson } from '../utils/safeJson.js';
import fs from 'fs';
import { convertToMp3, getAudioDuration } from '../utils/audioUtil.js';

// req.body = {
//     userId: "1111",
//     content: "",
//     type: "text/audio/photo"
// }

export const translateText = async (req, res) => {
    const userId = req.user.id;
    const length = req.body?.text?.length;

    console.log("req.body", req.body);

    if(!length) res.json(errorResponse("Пустой инпут"));
    
    const checkLimit = await limitService.checkUserTextLimit(userId, length);

    if(!checkLimit) {
        console.log("no limit")
        return res.json(errorResponse("Закончился лимит на перевод текста"));
    };
    
    const result = await translateService.translateText({ userId: userId, text: req.body.text });

    return res.json(result);
}

export const translateImage = async (req, res) => {
    const userId = req.user.id;
    const imageId = req.body.imageId;
    // const length = req.body?.text?.length;

    console.log("req.body", req.body);

    // if(!length) res.json(errorResponse("Пустой инпут"));
    
    // const checkLimit = await limitService.checkUserTextLimit(userId, length);

    // if(!checkLimit) {
    //     console.log("no limit")
    //     return res.json(errorResponse("Закончился лимит на перевод текста"));
    // };
    
    const result = await translateService.translateImage({ userId: userId, imageId: imageId });

    return res.json(result);
}

export const translateAudio = async (req, res) => {
    const userId = req.user.id;
    const filePath = req.file?.path;

    console.log("req.file", req?.file);
    console.log("filePath", filePath);

    if (!filePath) return res.json(errorResponse("No file uploaded"));

    // const outputPath = path.join('uploads', req.file.filename + '.mp3');
    let output;

    await convertToMp3(filePath)
    .then((outputPath) => {
        console.log("Converted");
        output = outputPath;
    })
    .catch(console.error);

    const duration = await getAudioDuration(output);

    const checkLimit = await limitService.checkUserAudioLimit(userId, duration);

    console.log("check limit - ", checkLimit);

    if(!checkLimit) {
        return res.json(errorResponse("Закончился лимит на перевод аудио"));
    };

    console.log("Final mp3 path:", output);

    const result = await translateService.translateAudio({ userId: userId, filePath: output, duration: duration });
    
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (output && fs.existsSync(output)) fs.unlinkSync(output);

    return res.json(result);
}