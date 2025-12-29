import { Component, input, output } from '@angular/core';
import { Post } from '../../models/post.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import { Comments } from '../../../../shared/components/comments/comments';

@Component({
  selector: 'app-post-list-item',
  imports: [
    TitleCasePipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    DatePipe,
    MatCardImage,
    MatCardActions,
    Comments,
  ],
  templateUrl: './post-list-item.html',
  styleUrl: './post-list-item.scss',
})
export class PostListItem {
  post = input.required<Post>();
  postCommented = output<{ comment: string; postId: number }>();

  protected onNewComment($event: string) {
    this.postCommented.emit({ comment: $event, postId: this.post().id });
  }
}
