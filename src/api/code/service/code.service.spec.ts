import { CodeService } from './code.service';

jest.mock('dynamoose');

describe('CodeService', () => {
	let service: CodeService;

	beforeEach(async () => {
		service = new CodeService();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
