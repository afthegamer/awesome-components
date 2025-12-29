import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Post } from '../../models/post.model';
import { PostListItem } from '../post-list-item/post-list-item';
import { AsyncPipe } from '@angular/common';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-list',
  imports: [PostListItem, AsyncPipe],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList implements OnInit {
  posts$!: Observable<Post[]>;
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostsService);

  ngOnInit(): void {
    this.posts$ = this.route.data.pipe(map((data) => data['posts'] as Post[]));
  }
  onPostCommented(postCommented: { comment: string; postId: number }) {
    console.log('onPostCommented', postCommented);
    this.postService.addNewComment(postCommented);
  }
}
