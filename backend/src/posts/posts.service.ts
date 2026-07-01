import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
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

async updateImage(
  postId: string,
  imagenUrl: string,
) {

  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  post.imagenUrl = imagenUrl;

  return post.save();
}

async removeImage(postId: string, userId: string) {
  const post = await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException('Publicación no encontrada');
  }

  if (post.autorId !== userId) {
    throw new BadRequestException('No tenés permisos para eliminar la foto');
  }

  post.imagenUrl = '';

  return post.save();
}

async addComment(
  postId: string,
  body: CreateCommentDto,
) {
  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  console.log('ANTES:', post.comentarios);

  if (!post.comentarios) {
    post.comentarios = [];
  }

  post.comentarios.push({
    ...body,
    fecha: new Date(),
    modificado: false,
  });

  console.log('DESPUÉS DEL PUSH:', post.comentarios);

  const saved = await post.save();

  console.log('GUARDADO:', saved.comentarios);

  return saved;
}

async getComments(
  postId: string,
  limit = 5,
  offset = 0,
) {

  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  const ordenados = [...post.comentarios].sort(
    (a, b) =>
      new Date(b.fecha).getTime() -
      new Date(a.fecha).getTime(),
  );

  return {
    comments: ordenados.slice(
      offset,
      offset + limit,
    ),
    total: ordenados.length,
  };
}

async updateComment(
  postId: string,
  commentId: string,
  body: UpdateCommentDto,
) {

  const post =
    await this.postModel.findById(postId);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  const comentario =
    post.comentarios.find(
      (c: any) =>
        c._id?.toString() === commentId,
    );

  if (!comentario) {
    throw new NotFoundException(
      'Comentario no encontrado',
    );
  }

  comentario.mensaje =
    body.mensaje;

  comentario.modificado =
    true;

  return post.save();
}

async findOne(id: string) {

  const post =
    await this.postModel.findById(id);

  if (!post) {
    throw new NotFoundException(
      'Publicación no encontrada',
    );
  }

  return post;
}

async getPostsByUser(
  desde?: string,
  hasta?: string,
) {

  const filtro: any = {
    deleted: false,
  };

  if (desde || hasta) {

    filtro.createdAt = {};

    if (desde) {
      filtro.createdAt.$gte =
        new Date(desde);
    }

    if (hasta) {

      const fin =
        new Date(hasta);

      fin.setHours(
        23,
        59,
        59,
        999,
      );

      filtro.createdAt.$lte = fin;

    }

  }

  const posts =
    await this.postModel.find(filtro);

  const resultado:
    Record<string, number> = {};

  posts.forEach(post => {

    resultado[post.autorNombre] =
      (resultado[post.autorNombre] || 0) + 1;

  });

  return Object.entries(resultado).map(
    ([usuario, cantidad]) => ({
      usuario,
      cantidad,
    }),
  );

}

async getCommentsByDate(
  desde?: string,
  hasta?: string,
) {

  const posts =
    await this.postModel.find({
      deleted: false,
    });

  const resultado:
    Record<string, number> = {};

  posts.forEach(post => {

    post.comentarios.forEach(
      (comentario: any) => {

        const fechaComentario =
          new Date(comentario.fecha);

        if (
          desde &&
          fechaComentario < new Date(desde)
        ) {
          return;
        }

        if (hasta) {

          const fin =
            new Date(hasta);

          fin.setHours(
            23,
            59,
            59,
            999,
          );

          if (fechaComentario > fin) {
            return;
          }

        }

        const fecha =
          fechaComentario
            .toISOString()
            .split('T')[0];

        resultado[fecha] =
          (resultado[fecha] || 0) + 1;

      },
    );

  });

  return Object.entries(resultado).map(
    ([fecha, cantidad]) => ({
      fecha,
      cantidad,
    }),
  );

}

async getCommentsByPost(
  desde?: string,
  hasta?: string,
) {

  const posts =
    await this.postModel.find({
      deleted: false,
    });

  return posts.map(post => {

    const cantidad =
      post.comentarios.filter(
        (comentario: any) => {

          const fecha =
            new Date(comentario.fecha);

          if (
            desde &&
            fecha < new Date(desde)
          ) {
            return false;
          }

          if (hasta) {

            const fin =
              new Date(hasta);

            fin.setHours(
              23,
              59,
              59,
              999,
            );

            if (fecha > fin) {
              return false;
            }

          }

          return true;

        },
      ).length;

    return {

      publicacion:
        post.titulo,

      cantidad,

    };

  });

}
}