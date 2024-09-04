import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Query,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CodeService } from '../service/code.service';
import {
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateStatusCodeDto } from '../dto/code';

@ApiTags('codes')
@Controller('api/v1/codes')
export class CodeController {
	constructor(private readonly CodeService: CodeService) {}

	@Post()
	@UsePipes(ValidationPipe)
	@ApiOperation({ summary: 'Create a new code' })
	@ApiResponse({
		status: 201,
		description: 'Status code created successfully.',
	})
	@ApiResponse({ status: 500, description: 'Error creating code.' })
	async create(@Body() createStatusCode: CreateStatusCodeDto, @Res() res) {
		try {
			const findCode = await this.CodeService.findOne(
				createStatusCode?.language,
				createStatusCode?.id
			);
			if (findCode) {
				return res.status(400).send({
					message: 'The code is already created',
				});
			}
			const data = await this.CodeService.createOrUpdate(createStatusCode);
			return res.status(201).send({ data });
		} catch (error) {
			throw new HttpException(
				{
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				},
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
	@Get(':lang')
	@ApiOperation({ summary: 'Retrieve a list of codes' })
	@ApiOkResponse({
		status: 200,
		description: 'Codes retrieved successfully.',
	})
	@ApiForbiddenResponse({ status: 403, description: 'Access forbidden.' })
	@ApiQuery({
		name: 'search',
		required: false,
		description: 'Optional search query',
	}) // Añadir esto
	async findAll(
		@Param('lang') lang: string,
		@Res() res,
		@Query('search') search?: string
	) {
		try {
			// Llamar al servicio con el valor opcional de 'search'
			const codes = await this.CodeService.findAll(lang, search || '');
			return res.status(HttpStatus.OK).send({
				data: codes,
			});
		} catch (error) {
			return res.status(HttpStatus.BAD_REQUEST).send({
				message: 'Error listing the codes',
			});
		}
	}

	@Get(':lang/:codeId')
	@ApiOperation({ summary: 'Retrieve a single code by ID and Lang' })
	@ApiParam({ name: 'lang', description: 'lang of the code', type: String })
	@ApiParam({ name: 'codeId', description: 'ID of the code', type: String })
	@ApiResponse({ status: 200, description: 'Code found.' })
	@ApiResponse({ status: 404, description: 'Code not found.' })
	async findOne(
		@Param('lang') lang: string,
		@Param('codeId') codeId: string,
		@Res() res
	) {
		try {
			const code = await this.CodeService.findOne(lang, codeId);
			if (!code) {
				return res.status(400).send({
					message: 'Code not found',
				});
			}
			return res.status(HttpStatus.OK).send({ code });
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
