import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Patch,
  ForbiddenException
} from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
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

  private checkAdmin(user: any) {

  if (user.perfil !== 'administrador') {

    throw new ForbiddenException(
      'Solo un administrador puede acceder a las estadísticas',
    );

  }

}

  @UseGuards(JwtAuthGuard)
  @Post()
create(
  @Body() createPostDto: CreatePostDto,
  @Req() req,
) {
  console.log('req.user:', req.user);
  console.log('autorNombre:', req.user.nombre);

  createPostDto.autorId = req.user.userId;
  createPostDto.autorNombre = req.user.nombre;

  console.log('dto:', createPostDto);

  return this.postsService.create(createPostDto);
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

@UseGuards(JwtAuthGuard)
@Delete(':id/image')
async removeImage(
  @Param('id') id: string,
  @Req() req,
) {
  return this.postsService.removeImage(id, req.user.userId);
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

@Post(':id/comments')
addComment(

  @Param('id')
  id: string,

  @Body()
  body: CreateCommentDto,

) {

  return this.postsService.addComment(
    id,
    body,
  );

}

@Get(':id/comments')
getComments(

  @Param('id')
  id: string,

  @Query('limit')
  limit?: string,

  @Query('offset')
  offset?: string,

) {

  return this.postsService.getComments(
    id,
    Number(limit) || 5,
    Number(offset) || 0,
  );

}

@Put(':postId/comments/:commentId')
updateComment(

  @Param('postId')
  postId: string,

  @Param('commentId')
  commentId: string,

  @Body()
  body: UpdateCommentDto,

) {

  return this.postsService.updateComment(
    postId,
    commentId,
    body,
  );

}

@Get(':id')
findOne(
  @Param('id') id: string,
) {
  return this.postsService.findOne(id);
}

@UseGuards(JwtAuthGuard)
@Get('stats/posts-by-user')
getPostsByUser(
  @Req() req,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {

  this.checkAdmin(req.user);

  return this.postsService.getPostsByUser(
    desde,
    hasta,
  );

}

@UseGuards(JwtAuthGuard)
@Get('stats/comments-by-date')
getCommentsByDate(
  @Req() req,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {

  this.checkAdmin(req.user);

  return this.postsService.getCommentsByDate(
    desde,
    hasta,
  );

}

@UseGuards(JwtAuthGuard)
@Get('stats/comments-by-post')
getCommentsByPost(
  @Req() req,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {

  this.checkAdmin(req.user);

  return this.postsService.getCommentsByPost(
    desde,
    hasta,
  );

}}