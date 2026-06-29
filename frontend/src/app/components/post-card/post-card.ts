import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink],
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

}