import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DocumentService } from './document.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3: AWS.S3;
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly documentService: DocumentService,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFilesInBatches(
    files: Express.Multer.File[],
    userId: number,
  ): Promise<AWS.S3.ManagedUpload.SendData[][]> {
    const batchSize = 3;
    const uploadPromises = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const uploadBatches = [];

      const documents = [];
      // Process each file in the batch concurrently
      files.slice(i, i + batchSize).map((file) => {
        const { originalname, buffer, mimetype } = file;
        const uploads = this.uploadToS3(buffer, originalname, mimetype);

        documents.push({
          name: originalname,
          userId: Number(userId),
        });

        uploadBatches.push(uploads);
      });

      // Push the batch upload promise into the main array
      uploadPromises.push(
        Promise.all([
          ...uploadBatches,
          this.documentService.createMany(documents),
        ]),
      );
    }

    this.logger.log('Uploading files in batches...');

    // Wait for all batches to finish uploading
    const response = await Promise.all(uploadPromises);

    this.logger.log('Files uploaded successfully');
    return response;
  }

  private async uploadToS3(
    file: Buffer,
    name: string,
    mimetype: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();

      return s3Response;
    } catch (error) {
      this.logger.error('Error uploading file to S3');
      throw error;
    }
  }
}
