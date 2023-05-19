import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  birthdate: string;
}
