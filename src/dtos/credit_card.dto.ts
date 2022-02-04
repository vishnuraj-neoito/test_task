import { IsNumber, IsString } from 'class-validator';

export class AddCreditCardDto {
	@IsNumber()
	child_id: number;

	@IsString()
	type: string;

	@IsString()
	number: string;

	@IsString()
	security_code: string;

	@IsNumber()
	expiration_month: number;

	@IsNumber()
	expiration_year: number;

	@IsString()
	monthly_limit: string;
}
export class GetCreditCardByIdDto {
	@IsNumber()
	public credit_card_id: number;
}
export class UpdateCardDto {
	@IsNumber()
	public credit_card_id: number;

	@IsString()
	public monthly_limit: string;
}

export class ChargeCardDto {
	@IsNumber()
	public credit_card_id: number;

	@IsString()
	public amount: string;
}

export class TransactionsListDto {
	@IsNumber()
	public credit_card_id: number;

	@IsNumber()
	public page: number;

	@IsNumber()
	public limit: number;
}
