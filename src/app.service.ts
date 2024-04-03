import { Injectable } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UserService } from './user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  async uploadFile(files: Express.Multer.File[], userId: number) {
    const upload = await this.uploadService.uploadFilesInBatches(files, userId);
    return upload;
  }
}
