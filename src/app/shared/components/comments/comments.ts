import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CommentModel } from '../../../core/models/comment.model';
import { ShortenPipe } from '../../pipes/shorten.pipe';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatLine } from '@angular/material/core';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ShortenPipe,
    TimeAgoPipe,
    MatIcon,
    MatLine,
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments {
  readonly comments = input.required<CommentModel[]>();
  readonly newComment = output<string>();

  readonly commentCtrl: FormControl<string>;

  // Liste locale (pour l’anim + ajout immédiat sans serveur)
  readonly commentList = signal<CommentModel[]>([]);

  private readonly fb = inject(FormBuilder);

  constructor() {
    this.commentCtrl = this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true,
    });

    // Synchronise l’input vers la liste locale
    effect(() => {
      this.commentList.set(this.comments());
    });
  }

  protected onLeaveComment() {
    if (this.commentCtrl.invalid) return;

    const current = this.comments();

    const maxId = current.length ? Math.max(...current.map((c) => c.id)) : 0;

    current.unshift({
      id: maxId + 1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1,
    });

    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }
}
