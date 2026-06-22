import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
} from '@nestjs/common';


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

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
  ) {
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
}