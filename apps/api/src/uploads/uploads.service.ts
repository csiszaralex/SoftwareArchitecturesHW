/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AppConfigService } from 'src/common/configs/app-config.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService implements OnModuleInit {
  private storage: admin.storage.Storage;

  constructor(private readonly configService: AppConfigService) {}

  onModuleInit() {
    // Csak egyszer inicializáljuk az appot
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(this.configService.get('GOOGLE_APPLICATION_CREDENTIALS')),
        storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
      });
    }
    this.storage = admin.storage();
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket();

    const filename = `parking-spots/${uuidv4()}-${file.originalname}`;
    const fileRef = bucket.file(filename);

    if (!file.buffer) {
      throw new Error('File buffer is empty. Ensure you are using multer memory storage.');
    }

    await fileRef.save(Buffer.from(file.buffer), {
      metadata: {
        contentType: file.mimetype ?? 'application/octet-stream',
      },
    });

    await fileRef.makePublic();
    return `https://storage.googleapis.com/${this.configService.get('FIREBASE_STORAGE_BUCKET')}/${filename}`;
  }
}
