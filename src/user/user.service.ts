import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (!(await this.userRepository.findOneBy({ email: createUserDto.email })))
      return this.userRepository.save(createUserDto);
    throw new ConflictException('user with provided email exists');
  }

  async findAll() {
    const users = await this.userRepository.find();
    if (users.length) return users;
    throw new NotFoundException('no users found');
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) return user;
    throw new NotFoundException(`user ${id} not found`);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      return `successfully updated user ${id}`;
    } catch (error) {
      throw new UnprocessableEntityException(`cannot update user ${id}`);
    }
  }

  async remove(id: number) {
    if (await this.userRepository.findOneBy({ id })) {
      await this.userRepository.delete({ id });
      return `successfully deleted user ${id}`;
    }
    throw new NotFoundException(`user ${id} not found`);
  }
}
