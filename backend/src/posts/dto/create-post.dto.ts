export class CreatePostDto {
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  autorId: string;
  autorNombre: string;
}