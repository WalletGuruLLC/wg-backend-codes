export class CreateStatusCodeDto {
	id: string;
	description: string;
	language: string;
	text: string;
}

export class DeleteStatusCodeDto {
	id?: string;
	active?: boolean;
}
