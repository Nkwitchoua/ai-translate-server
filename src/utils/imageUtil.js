import sharp from 'sharp';
import fs from 'fs';

async function compressImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize({ width: 1024 })
    .jpeg({ quality: 80 })
    .toFile(outputPath);

  console.log('Готово!');
}
