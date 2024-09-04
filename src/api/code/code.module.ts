import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CodeService } from './service/code.service';
import { CodeController } from './controller/code.controller';

@Module({
	imports: [ConfigModule],
	controllers: [CodeController],
	providers: [CodeService],
	exports: [CodeService],
})
export class StatusCodeModule {}
