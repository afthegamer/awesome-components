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
import { ShortenPipe } from '../../../../shared/pipes/shorten.pipe';
import { UsernamePipe } from '../../../../shared/pipes/username.pipe';

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
    ShortenPipe,
    UsernamePipe,
  ],
  templateUrl: './post-list-item.html',
  styleUrl: './post-list-item.scss',
})
export class PostListItem {
  post = input.required<Post>();
  postCommented = output<{ comment: string; postId: number }>();
  tempUser: { firstName: string; lastName: string } = { firstName: 'Brad', lastName: 'Pitt' };

  protected onNewComment($event: string) {
    this.postCommented.emit({ comment: $event, postId: this.post().id });
  }
}
