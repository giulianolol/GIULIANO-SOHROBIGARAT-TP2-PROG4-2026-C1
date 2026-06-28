import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { PostsService } from '../../../core/services/posts.service';

@Component({
  selector: 'app-detalle-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:
    './detalle-publicacion.html',
  styleUrl:
    './detalle-publicacion.scss',
})
export class DetallePublicacion
implements OnInit {

  private route =
    inject(ActivatedRoute);

  private postsService =
    inject(PostsService);

  post = signal<any | null>(null);
  comentarios = signal<any[]>([]);
  nuevoComentario = '';
  editingCommentId = '';
  commentOffset = 0;
  commentLimit = 5;
  hasMoreComments = true;
  editedMessage = '';
  user = JSON.parse(
  localStorage.getItem('user')!
  
);

ngOnInit() {

  console.log('Entré al detalle');

  const id = this.route.snapshot.paramMap.get('id');

  console.log(id);

  if (!id) return;

  console.log('Antes de llamar a getPost');

  this.postsService.getPost(id).subscribe({
    next: (post) => {

      console.log('POST RECIBIDO:', post);

      this.post.set(post);

    },
    error: (err) => {

      console.error('ERROR GET POST:', err);

    },
  });

  this.postsService
    .getComments(
      id,
      this.commentLimit,
      this.commentOffset,
    )
    .subscribe((response) => {

      this.comentarios.set(
        response.comments,
      );

      this.hasMoreComments =
        this.commentOffset +
        response.comments.length <
        response.total;

    });

}

comentar() {

  

  if (!this.nuevoComentario.trim()) {
    return;
  }

  const user = JSON.parse(
    localStorage.getItem('user')!
  );

  const id =
    this.route.snapshot.paramMap.get('id');

  if (!id) return;

  this.postsService.addComment(id, {
    autorId: user._id,
    autor: user.username,
    mensaje: this.nuevoComentario,
  }).subscribe(() => {

    this.postsService
      .getComments(id)
.subscribe((response) => {

  this.comentarios.set(response.comments);

  this.hasMoreComments =
    response.comments.length === this.commentLimit;

});

    this.nuevoComentario = '';

  });

}

startEdit(comment: any) {

  this.editingCommentId = comment._id;

  this.editedMessage = comment.mensaje;

}

saveComment(commentId: string) {

  const id =
    this.route.snapshot.paramMap.get('id');

  if (!id) return;

  this.postsService.updateComment(
    id,
    commentId,
    this.editedMessage,
  ).subscribe(() => {

    this.commentOffset = 0;
    this.hasMoreComments = true;

    this.postsService
      .getComments(id)
.subscribe((response) => {

  this.comentarios.set(response.comments);

  this.hasMoreComments =
    response.comments.length === this.commentLimit;

});

    this.editingCommentId = '';

    this.editedMessage = '';

  });

}
loadMoreComments() {

  this.commentOffset += this.commentLimit;

  const id =
    this.route.snapshot.paramMap.get('id');

  if (!id) return;

  this.postsService
    .getComments(
      id,
      this.commentLimit,
      this.commentOffset,
    )
.subscribe((response) => {

  this.comentarios.update(actuales => [
    ...actuales,
    ...response.comments,
  ]);

  this.hasMoreComments =
    this.commentOffset +
    response.comments.length <
    response.total;

});

}


}