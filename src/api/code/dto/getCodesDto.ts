import { ApiProperty } from '@nestjs/swagger';

export class GetStatusCodeDto {
	@ApiProperty({ description: 'Filter by lang' })
	lang?: string;

	@ApiProperty({ description: 'Filter by id' })
	search?: string;
}
