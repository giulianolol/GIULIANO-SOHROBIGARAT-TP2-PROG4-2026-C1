import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {

  @Input() post: any;

  @Input() user: any;

  @Output() like =
    new EventEmitter<void>();

  @Output() unlike =
    new EventEmitter<void>();

  @Output() delete =
    new EventEmitter<void>();

  @Output() removeImage =
    new EventEmitter<void>();

  get isLiked(): boolean {
    return !!this.post?.likes?.includes(this.user?._id);
  }

  toggleLike(): void {
    if (this.isLiked) {
      this.unlike.emit();
    } else {
      this.like.emit();
    }
  }

}