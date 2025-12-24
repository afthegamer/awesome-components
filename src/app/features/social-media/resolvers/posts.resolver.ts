import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/post.model';

export const postsResolver: ResolveFn<Post[]> = () => {
  return inject(PostsService).getPosts();
};
