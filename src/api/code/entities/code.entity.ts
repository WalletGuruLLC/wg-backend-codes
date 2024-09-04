import { Document } from 'dynamoose/dist/Document';

export interface StatusCode extends Document {
	Id: string;
	Description: string;
	StatusCodeTranslations: Array<any>;
}
