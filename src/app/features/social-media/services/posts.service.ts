import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class PostsService {
  constructor(private readonly http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }

  addNewComment(postCommented: { comment: string; postId: number }) {
    console.log('addNewComment', postCommented);
    // this.http
    //   .post(`${environment.apiUrl}/posts/${postCommented.postId}/comments`, postCommented)
    //   .subscribe();
  }
}
