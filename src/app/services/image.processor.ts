import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as AdmZip from 'adm-zip';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { Express } from 'express';

@Processor('image')
export class ImageProcessor {
  @Process('optimize')
  async handleOptimization(job: Job) {
    const files: Express.Multer.File[] = job.data.files;
    return files;
  }
}
