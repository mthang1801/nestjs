import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [String],
  exports: [String],
})
export class StringModule {}
