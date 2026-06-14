import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const emailExists = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (emailExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const usernameExists = await this.usersService.findByUsername(
      registerDto.username,
    );

    if (usernameExists) {
      throw new BadRequestException('El nombre de usuario ya existe');
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(registerDto.password)) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
      );
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const userObject = (user as any).toObject();

    delete userObject.password;

    return userObject;
  }

  async login(loginDto: LoginDto) {
  const user = await this.usersService.findByEmailOrUsername(
    loginDto.usuario,
  );

  if (!user) {
    throw new BadRequestException(
      'Usuario o contraseña incorrectos',
    );
  }

  const passwordOk = await bcrypt.compare(
    loginDto.password,
    user.password,
  );

  if (!passwordOk) {
    throw new BadRequestException(
      'Usuario o contraseña incorrectos',
    );
  }

  const userObject = (user as any).toObject();

  delete userObject.password;

  return userObject;
}
}