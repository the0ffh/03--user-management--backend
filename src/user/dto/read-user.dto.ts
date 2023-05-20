import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ReadUserDto extends CreateUserDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  id: number;
}
