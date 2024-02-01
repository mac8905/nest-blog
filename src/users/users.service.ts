import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { username, isAdmin } = updateUserDto;
    const userToUpdate = await this.userModel.findById(id).exec();

    if (!userToUpdate) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!userToUpdate.isAdmin) {
      throw new UnauthorizedException(
        'No tienes permisos para actualizar este usuario',
      );
    }

    if (username) {
      userToUpdate.username = username;
    }

    if (isAdmin !== undefined) {
      userToUpdate.isAdmin = isAdmin;
    }

    try {
      return await userToUpdate.save();
    } catch (error) {
      throw new Error('Error al actualizar el usuario');
    }
  }

  async remove(id: string) {
    const requestingUser = await this.userModel.findById(id).exec();

    if (!requestingUser || !requestingUser.isAdmin) {
      throw new UnauthorizedException(
        'No tienes permisos para eliminar este usuario',
      );
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
