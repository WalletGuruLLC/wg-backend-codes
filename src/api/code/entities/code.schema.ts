import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const StatusCodeSchema = new dynamoose.Schema(
	{
		Id: {
			type: String,
			hashKey: true,
			default: () => uuidv4(),
		},
		Description: String,
		StatusCodeTranslations: Array,
	},
	{
		timestamps: {
			createdAt: 'CreateDate',
			updatedAt: 'UpdateDate',
		},
	}
);
