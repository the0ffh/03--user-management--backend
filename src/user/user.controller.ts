import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadUserDto } from './dto/read-user.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body(
      new ValidationPipe({
        transform: true,
        validationError: { target: true },
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'return all users',
    type: ReadUserDto,
    isArray: true,
  })
  @Get()
  findAll(): Promise<ReadUserDto[]> {
    return this.userService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'return user',
    type: ReadUserDto,
  })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<ReadUserDto> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(
      new ValidationPipe({
        transform: true,
        validationError: { target: true },
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
