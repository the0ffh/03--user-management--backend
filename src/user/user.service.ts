import {
  ConflictException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (
      !(await this.userRepository.findOneBy({ email: createUserDto.email }))
    ) {
      const user = await this.userRepository.save(createUserDto);
      this.logger.log(`user ${user.id} created`);
      return user.id;
    }
    throw new ConflictException('user with provided email exists');
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length) return users;
    throw new NotFoundException('no users found');
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) return user;
    throw new NotFoundException(`user ${id} not found`);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<number> {
    if (await this.findOne(id))
      try {
        await this.userRepository.update(id, updateUserDto);
        this.logger.log(`successfully updated user ${id}`);
        return id;
      } catch (error) {
        this.logger.error(error);
        throw new UnprocessableEntityException(`cannot update user ${id}`);
      }
    else throw new NotFoundException(`user ${id} not found`);
  }

  async remove(id: number) {
    if (await this.userRepository.findOneBy({ id })) {
      const deleteResult = await this.userRepository.delete({ id });
      if (deleteResult.affected)
        this.logger.log(`successfully deleted user ${id}`);
      else {
        this.logger.error(`failed to delete user ${id}`);
        throw new UnprocessableEntityException(`failed to delete user ${id}`);
      }
    }
    throw new NotFoundException(`user ${id} not found`);
  }
}
