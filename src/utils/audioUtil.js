import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

export const convertToMp3 = (inputPath) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(inputPath);
    const base = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);

    const outputPath = path.join(dir, `${base}.mp3`);

    ffmpeg(inputPath)
      .output(outputPath)
      .audioCodec('libmp3lame')
      .audioBitrate(64)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('mp3')
      .on('end', () => {
        console.log('Конвертация завершена:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Ошибка при конвертации:', err.message);
        reject(err);
      })
      .run();
  });
};

export const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = Math.round(metadata.format.duration);
      resolve(duration);
    });
  });
};