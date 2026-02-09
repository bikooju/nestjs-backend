import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UpdateProfileRequestDto } from './dto/request/update-profile.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return new UserResponseDto(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    const updatedUser = await this.userRepository.save(user);
    return new UserResponseDto(updatedUser);
  }
}
