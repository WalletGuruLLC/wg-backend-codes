import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { Injectable } from '@nestjs/common';
import { StatusCode } from '../entities/code.entity';
import { StatusCodeSchema } from '../entities/code.schema';
import { CreateStatusCodeDto } from '../dto/code';
import { convertToCamelCase } from '../../../utils/helpers/convertCamelCase';

@Injectable()
export class CodeService {
	private readonly dbInstance: Model<StatusCode>;

	constructor() {
		const tableName = 'StatusCode';
		this.dbInstance = dynamoose.model<StatusCode>(tableName, StatusCodeSchema, {
			create: false,
			waitForActive: false,
		});
	}
	async createOrUpdate(createStatusCode: CreateStatusCodeDto) {
		const { id, description, language, text } = createStatusCode;

		const newTranslation = {
			language,
			text,
		};

		const existingCode = await this.dbInstance.get({ Id: id });

		if (existingCode) {
			existingCode.Description = description;

			existingCode.StatusCodeTranslations =
				existingCode.StatusCodeTranslations || [];

			const existingTranslation = existingCode.StatusCodeTranslations.find(
				translation => translation.language === language
			);

			if (existingTranslation) {
				existingTranslation.text = text;
				existingTranslation.description = description;
			} else {
				existingCode.StatusCodeTranslations.push(newTranslation);
			}

			return this.dbInstance.update({ Id: id }, existingCode);
		} else {
			const code = {
				Id: id,
				Description: description,
				StatusCodeTranslations: [newTranslation],
			};

			return this.dbInstance.create(code);
		}
	}
	async findAll(
		lang: string,
		search?: string
	): Promise<{ translations: any[] }> {
		const docClient = new DocumentClient();
		const params: DocumentClient.ScanInput = {
			TableName: 'StatusCode',
		};

		const result = await docClient.scan(params).promise();
		const codes = convertToCamelCase(result.Items || []);

		let translations = codes.flatMap(
			code =>
				code.statusCodeTranslations?.filter(
					translation => translation.language === lang
				) || []
		);

		if (translations.length === 0) {
			translations = codes.flatMap(
				code =>
					code.statusCodeTranslations?.filter(
						translation => translation.language === 'EN'
					) || []
			);
		}

		if (search) {
			const regex = new RegExp(search, 'i');
			translations = translations.filter(translation =>
				regex.test(translation.text)
			);
		}

		return {
			translations,
		};
	}

	async findOne(lang: string, codeId: string) {
		const docClient = new DocumentClient();
		const params: DocumentClient.ScanInput = {
			TableName: 'StatusCode',
		};

		const result = await docClient.scan(params).promise();
		const codes = convertToCamelCase(result.Items || []);

		const codesFilterId = codes.filter(code => code.id === codeId);

		let filteredTranslation = codesFilterId
			.flatMap(
				code =>
					code.statusCodeTranslations?.filter(
						translation => translation.language === lang
					) || []
			)
			.find(translation => translation);

		if (!filteredTranslation) {
			filteredTranslation = codesFilterId
				.flatMap(code => code.statusCodeTranslations || [])
				.find(translation => translation);
		}

		return convertToCamelCase(filteredTranslation || {});
	}
}
