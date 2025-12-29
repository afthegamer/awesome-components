import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Angular Material (imports directs, comme tu le veux)
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-complex-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  templateUrl: './complex-form.html',
  styleUrl: './complex-form.scss',
})
export class ComplexForm implements OnInit {
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initMainForm();
  }

  onSubmitForm(): void {
    // sera implémenté plus tard dans le cours
  }

  private initMainForm(): void {
    this.mainForm = this.fb.group({});
  }
}
