import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatList, MatListItem, MatListSubheaderCssMatStyler } from '@angular/material/list';
import { MatLine } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CommentModel } from '../../../core/models/comment.model';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [
    MatList,
    MatListItem,
    MatListSubheaderCssMatStyler,
    MatLine,
    DatePipe,
    MatFormField,
    MatInput,
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments implements OnInit {
  comments = input.required<CommentModel[]>();
  newComment = output<string>();
  commentCtrl!: FormControl;
  private readonly formBuilder = inject<FormBuilder>(FormBuilder);
  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(10),
    ]);
  }

  protected onLeaveComment() {
    if (this.commentCtrl.valid) {
      this.newComment.emit(this.commentCtrl.value);
      this.commentCtrl.reset();
    } else {
      this.commentCtrl.markAsTouched();
    }
  }
}
