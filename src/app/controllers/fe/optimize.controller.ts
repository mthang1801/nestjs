import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BaseController } from '../../../base/base.controllers';
@Controller('optimize')
export class OptimizeController extends BaseController {
  constructor(@InjectQueue('image') private readonly imageQueue: Queue) {
    super();
  }

  @Post('image')
  @UseInterceptors(AnyFilesInterceptor())
  async processImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res,
  ): Promise<any> {
    const job = await this.imageQueue.add('optimize', { files });
    return {
      jobId: job.id,
    };
  }
}
