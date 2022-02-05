import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor()
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);
}
