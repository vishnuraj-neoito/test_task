import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString()
	public name: string;

	@IsString()
	public email: string;

	@IsString()
	public password: string;
}

export class LoginDto {
	@IsEmail()
	public email: string;

	@IsString()
	public password: string;
}
