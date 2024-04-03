import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]) {
    if (files.length > 100) {
      throw new BadRequestException(
        'Cannot upload more than 100 files at a time',
      );
    }

    files.forEach((file) => {
      const defaultSize = 10 * 1024 * 1024; // 10MB
      if (file.size > defaultSize) {
        throw new BadRequestException('File size should not exceed 10MB');
      }

      const allowedTypes = ['.pdf', '.txt'];
      const extension = path.extname(file.originalname);
      if (!allowedTypes.includes(extension)) {
        throw new BadRequestException('Only .pdf and .txt files are allowed');
      }
    });

    return files;
  }
}
