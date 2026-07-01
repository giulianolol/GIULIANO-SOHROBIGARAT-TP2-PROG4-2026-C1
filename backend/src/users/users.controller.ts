import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Request,
  Delete,
  Param,
  ForbiddenException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  private checkAdmin(user: any) {

    if (user.perfil !== 'administrador') {

      throw new ForbiddenException(
        'Solo un administrador puede realizar esta acción',
      );

    }

  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req,
  ) {

    this.checkAdmin(req.user);

    return this.usersService.findAll();

  }

  @Post()
  @UseGuards(JwtAuthGuard)
 async create(
  @Request() req,
  @Body() body,
) {

  this.checkAdmin(req.user);

  return this.usersService.createByAdmin(body);

}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async disable(
    @Request() req,
    @Param('id') id: string,
  ) {

    this.checkAdmin(req.user);

    return this.usersService.disable(id);

  }

  @Post(':id/enable')
  @UseGuards(JwtAuthGuard)
  async enable(
    @Request() req,
    @Param('id') id: string,
  ) {

    this.checkAdmin(req.user);

    return this.usersService.enable(id);

  }

}