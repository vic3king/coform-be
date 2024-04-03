import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Document } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    return this.prisma.document.create({
      data,
    });
  }

  async createMany(
    data: Prisma.DocumentCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.document.createMany({
      data,
    });
  }
}
