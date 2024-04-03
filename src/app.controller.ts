import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Request,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { FileSizeValidationPipe } from './common/Pipe/file-validator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('users/:userId/documents')
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new FileSizeValidationPipe())
  async uploadFile(
    @UploadedFiles()
    files,
    @Request() req,
  ) {
    return await this.appService.uploadFile(files, req.params.userId);
  }
}
