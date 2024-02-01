import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    if (await this.findOne(username)) {
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

  async findAll() {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new Error('Error al obtener la lista de usuarios');
    }
  }

  async findOne(field: string) {
    let findUser;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(field);

    if (isObjectId) {
      findUser = await this.userModel.findById(field).exec();
    } else {
      findUser = await this.userModel.findOne({ username: field }).exec();
    }

    if (!findUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return findUser._doc;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
