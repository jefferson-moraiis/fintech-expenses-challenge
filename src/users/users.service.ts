import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const user = await this.prisma.user.create({ data });
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
