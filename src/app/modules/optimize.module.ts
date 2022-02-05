import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OptimizeController } from '../controllers/fe/optimize.controller';
import { ImageProcessor } from '../services/image.processor';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image',
    }),
  ],
  controllers: [OptimizeController],
  providers: [ImageProcessor],
})
export class OptimizeModule {}
