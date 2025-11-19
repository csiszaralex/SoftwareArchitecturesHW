import { FileValidator } from '@nestjs/common';

export class ImageFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  buildErrorMessage(): string {
    return 'Csak képfájl tölthető fel! (Támogatott: jpg, png, jpeg, webp)';
  }

  isValid(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    return allowedMimeTypes.includes(file.mimetype);
  }
}
