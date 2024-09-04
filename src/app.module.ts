import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatusCodeModule } from './api/code/code.module';

@Module({
	imports: [ConfigModule.forRoot(), StatusCodeModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
