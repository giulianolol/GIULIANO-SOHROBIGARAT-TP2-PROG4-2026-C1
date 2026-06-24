import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Patch
} from '@nestjs/common';

import { UpdateImageDto } from './dto/update-image.dto';
import { Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeletePostDto } from './dto/delete-post.dto';
import { Param } from '@nestjs/common';
import { LikePostDto } from './dto/like-post.dto';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    createPostDto.autorId =
    req.user.userId;

    return this.postsService.create(
      createPostDto,
    );
  }

  @Get()
  findAll(
    @Query('sort') sort?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('autorId') autorId?: string,
  ) {
    return this.postsService.findAll(
      sort,
      Number(limit) || 10,
      Number(offset) || 0,
      autorId,
    );
  }

@Post(':id/like')
addLike(
  @Param('id') id: string,
  @Body() body: LikePostDto,
) {
  console.log(body);

  return this.postsService.addLike(
    id,
    body.userId,
  );
}

@Delete(':id/like')
removeLike(
  @Param('id') id: string,
  @Body() body: LikePostDto,
) {
  return this.postsService.removeLike(
    id,
    body.userId,
  );
}

@Delete(':id/image')
removeImage(
  @Param('id') id: string,
) {
  return this.postsService.removeImage(
    id,
  );
}

@Delete(':id')
deletePost(
  @Param('id') id: string,
  @Body() body: DeletePostDto,
) {
  return this.postsService.deletePost(
    id,
    body.userId,
    body.perfil,
  );
}



@Patch(':id/image')
updateImage(
  @Param('id') id: string,
  @Body() body: UpdateImageDto,
) {
  return this.postsService.updateImage(
    id,
    body.imagenUrl,
  );
}
}