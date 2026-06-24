import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import cloudinary from '../cloudinary/cloudinary.config';
import * as fs from 'fs';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
async uploadFile(
  @UploadedFile() file: any,
) {

  const result =
    await cloudinary.uploader.upload(
      file.path,
      {
        folder: 'red-social',
      },
    );

  fs.unlinkSync(file.path);

  return {
    imageUrl: result.secure_url,
  };
}
}