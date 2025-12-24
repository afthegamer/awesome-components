import { Routes } from '@angular/router';
import { PostsService } from './services/posts.service';
import { postsResolver } from './resolvers/posts.resolver';

export const SOCIAL_MEDIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/post-list/post-list').then((m) => m.PostList),
    resolve: { posts: postsResolver },
    providers: [PostsService], // scope feature (équivalent module lazy)
  },
];
