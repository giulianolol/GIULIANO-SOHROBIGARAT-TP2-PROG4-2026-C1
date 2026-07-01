import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async findByEmailOrUsername(usuario: string): Promise<User | null> {
  return this.userModel.findOne({
    $or: [
      { email: usuario },
      { username: usuario },
    ],
  });
}
  async disable(id: string) {

  return this.userModel.findByIdAndUpdate(
    id,
    {
      activo: false,
    },
    {
      new: true,
    },
  );

}

async enable(id: string) {

  return this.userModel.findByIdAndUpdate(
    id,
    {
      activo: true,
    },
    {
      new: true,
    },
  );

}

async findAll() {

  return this.userModel.find();

}

async findById(id: string) {

  return this.userModel.findById(id);

}

async createByAdmin(userData: Partial<User>) {

  const emailExists = await this.findByEmail(
    userData.email!,
  );

  if (emailExists) {
    throw new BadRequestException(
      'El email ya está registrado',
    );
  }

  const usernameExists =
    await this.findByUsername(
      userData.username!,
    );

  if (usernameExists) {
    throw new BadRequestException(
      'El nombre de usuario ya existe',
    );
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (
    !passwordRegex.test(
      userData.password!,
    )
  ) {
    throw new BadRequestException(
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      userData.password!,
      10,
    );

  const user =
    new this.userModel({
      ...userData,
      password: hashedPassword,
      activo: true,
    });

  return user.save();

}

}