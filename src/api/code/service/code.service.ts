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
		const docClient = new DocumentClient();
		const { id, description, language, text } = createStatusCode;

		const newTranslation = {
			language,
			text,
		};

		const paramsGet: DocumentClient.GetItemInput = {
			TableName: 'StatusCode',
			Key: { Id: id },
		};

		const existingCodeData = await docClient.get(paramsGet).promise();
		const existingCode = existingCodeData.Item;

		if (existingCode) {
			existingCode.Description = description;
			existingCode.StatusCodeTranslations =
				existingCode.StatusCodeTranslations || [];

			const existingTranslation = existingCode.StatusCodeTranslations.find(
				translation => translation.language === language
			);

			if (existingTranslation) {
				existingTranslation.text = text;
			} else {
				existingCode.StatusCodeTranslations.push(newTranslation);
			}

			const paramsUpdate: DocumentClient.UpdateItemInput = {
				TableName: 'StatusCode',
				Key: { Id: id },
				UpdateExpression:
					'set Description = :description, StatusCodeTranslations = :translations',
				ExpressionAttributeValues: {
					':description': existingCode.Description,
					':translations': existingCode.StatusCodeTranslations,
				},
				ReturnValues: 'ALL_NEW',
			};

			const updatedCode = await docClient.update(paramsUpdate).promise();
			return updatedCode.Attributes;
		} else {
			const code = {
				Id: id,
				Description: description,
				StatusCodeTranslations: [newTranslation],
			};

			const paramsPut: DocumentClient.PutItemInput = {
				TableName: 'StatusCode',
				Item: code,
			};

			await docClient.put(paramsPut).promise();
			return code;
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
				code.statusCodeTranslations
					?.filter(translation => translation.language === lang)
					.map(translation => ({
						id: code.id,
						description: code.description,
						...translation,
					})) || []
		);

		if (translations.length === 0) {
			translations = codes.flatMap(
				code =>
					code.statusCodeTranslations
						?.filter(translation => translation.language === 'EN')
						.map(translation => ({
							id: code.id,
							description: code.description,
							...translation,
						})) || []
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
		const params: DocumentClient.QueryInput = {
			TableName: 'StatusCode',
			KeyConditionExpression: 'Id = :codeId',
			ExpressionAttributeValues: {
				':codeId': codeId,
			},
		};

		const result = await docClient.query(params).promise();
		const codes = convertToCamelCase(result.Items || []);

		const code = codes.find(code => code.id === codeId);

		if (code && lang && lang !== '{lang}') {
			code.statusCodeTranslations = code.statusCodeTranslations?.filter(
				translation => translation.language === lang
			);
		}

		return code || {};
	}
}
