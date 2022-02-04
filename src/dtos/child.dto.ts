import { IsNumber, IsString } from 'class-validator';

export class AddChildDto {
	@IsString()
	public name: string;

	@IsNumber()
	public age: number;
}

export class CommonListDto {
	@IsNumber()
	public page: number;

	@IsNumber()
	public limit: number;
}

export class GetChildByIdDto {
	@IsNumber()
	public child_id: number;
}

export class UpdateChildDto {
	@IsNumber()
	public child_id: number;

	@IsString()
	public name: string;

	@IsNumber()
	public age: number;
}
