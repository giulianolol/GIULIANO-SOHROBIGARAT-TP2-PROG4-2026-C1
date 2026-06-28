import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ _id: true })
export class Comment {

  @Prop({ required: true })
  autorId: string;

  @Prop({ required: true })
  autor: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ default: Date.now })
  fecha: Date;

  @Prop({ default: false })
  modificado: boolean;
}

export const CommentSchema =
  SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Post {

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop()
  imagenUrl: string;

  @Prop({ required: true })
  autorId: string;

  @Prop({
    type: [String],
    default: [],
  })
  likes: string[];

  @Prop({
    type: [CommentSchema],
    default: [],
  })
  comentarios: Comment[];

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  autorNombre: string;
}

export const PostSchema =
  SchemaFactory.createForClass(Post);