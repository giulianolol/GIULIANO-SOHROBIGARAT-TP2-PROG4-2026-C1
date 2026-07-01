import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

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

  if (!user.activo) {
  throw new BadRequestException(
    'El usuario se encuentra deshabilitado',
  );
}

const userObject = (user as any).toObject();

delete userObject.password;

console.log('userObject:', userObject);

const payload = {
  sub: userObject._id,
  email: userObject.email,
  perfil: userObject.perfil,
  nombre: userObject.nombre
};

// console.log('JWT LOGIN');

return {
  access_token: this.jwtService.sign(payload),
  user: userObject,
};
}

async refresh(user: any) {

  const payload = {

    sub: user.userId,
    email: user.email,
    perfil: user.perfil,
    nombre: user.nombre,

  };

  return {

    access_token:
      this.jwtService.sign(payload),

  };

}
}