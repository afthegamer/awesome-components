import { Component, input } from '@angular/core';
import { Post } from '../../models/post.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-post-list-item',
  imports: [TitleCasePipe],
  templateUrl: './post-list-item.html',
  styleUrl: './post-list-item.scss',
})
export class PostListItem {
  post = input.required<Post>();
}
