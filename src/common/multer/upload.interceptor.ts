import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function FileUpload(fieldName = 'image') {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: './public/uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now();
            const fileExt = extname(file.originalname);
            cb(null, `${uniqueSuffix}${fileExt}`);
          },
        }),
      }),
    ),
  );
}
