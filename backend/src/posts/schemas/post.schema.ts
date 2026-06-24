import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

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

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  autorNombre: string;
}

export const PostSchema =
  SchemaFactory.createForClass(Post);