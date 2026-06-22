import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Post,
  PostDocument,
} from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  async create(
    postData: Partial<Post>,
  ): Promise<Post> {
    const post = new this.postModel(postData);

    return post.save();
  }

  async findAll(
    sort = 'fecha',
    limit = 5,
    offset = 0,
    autorId?: string,
  ): Promise<Post[]> {
    const filter: any = {
      deleted: false,
    };

    if (autorId) {
      filter.autorId = autorId;
    }

    const sortOption: any =
    sort === 'likes'
    ? { likes: -1 }
    : { createdAt: -1 };

    return this.postModel
      .find(filter)
      .sort(sortOption)
      .skip(offset)
      .limit(limit);
  }

  async addLike(
  postId: string,
  userId: string,
) {
  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  if (post.likes.includes(userId)) {
    throw new BadRequestException(
      'Ya diste like a esta publicación',
    );
  }

  post.likes.push(userId);

  return post.save();
}
  async removeLike(
  postId: string,
  userId: string,
) {
  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  if (!post.likes.includes(userId)) {
    throw new BadRequestException(
      'No habías dado like a esta publicación',
    );
  }

  post.likes = post.likes.filter(
    (id) => id !== userId,
  );

  return post.save();
}
async deletePost(
  postId: string,
  userId: string,
  perfil: string,
) {
  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  const isOwner =
    post.autorId === userId;

  const isAdmin =
    perfil === 'administrador';

  if (!isOwner && !isAdmin) {
    throw new BadRequestException(
      'No tenés permisos para eliminar esta publicación',
    );
  }

  post.deleted = true;

  return post.save();
}

}