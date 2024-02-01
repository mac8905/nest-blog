import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, isAdmin } = createUserDto;

    if (this.findOne(username)) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const user = new this.userModel({
      username,
      password,
      isAdmin,
    });

    try {
      return await user.save();
    } catch (error) {
      throw new Error('Error al crear el usuario');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(field: string) {
    return { username: 'root', password: 'root' };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
