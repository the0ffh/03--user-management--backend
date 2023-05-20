import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: 'string', nullable: false })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ type: 'string', nullable: false })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ type: 'string', nullable: false })
  @IsString()
  @MinLength(1)
  address: string;

  @ApiProperty({ type: 'string', nullable: false })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', nullable: false })
  @IsString()
  @MinLength(1)
  birthdate: string;
}
