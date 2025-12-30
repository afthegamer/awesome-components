import { Component, computed, DestroyRef, effect, inject, Injector, Signal, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { finalize, startWith } from 'rxjs';

import { ComplexFormValue } from '../../models/complex-form-value.model';
import { ComplexFormService } from '../../services/complex-form.service';

type ContactPreference = 'email' | 'phone';

@Component({
  selector: 'app-complex-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './complex-form.html',
  styleUrl: './complex-form.scss',
})
export class ComplexForm {
  // --- UI state
  readonly isSaving = signal(false);
  readonly saveError = signal<string | null>(null);

  // --- Forms
  mainForm!: FormGroup;

  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl<ContactPreference>;

  phoneCtrl!: FormControl<string>;

  emailCtrl!: FormControl<string>;
  confirmEmailCtrl!: FormControl<string>;
  emailForm!: FormGroup;

  passwordCtrl!: FormControl<string>;
  confirmPasswordCtrl!: FormControl<string>;
  loginInfoForm!: FormGroup;

  // --- Préférence de contact sous forme de Signal
  // (initialisée après la création de contactPreferenceCtrl)
  contactPreference!: Signal<ContactPreference>;
  readonly showEmail = computed(() => this.contactPreference() === 'email');
  readonly showPhone = computed(() => this.contactPreference() === 'phone');

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ComplexFormService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  constructor() {
    this.initFormControls();
    this.initMainForm();
    this.initReactiveBehavior();
  }

  onSubmitForm(): void {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    const payload = this.mainForm.getRawValue() as ComplexFormValue;

    this.service
      .saveUserInfo(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSaving.set(false)),
      )
      .subscribe((ok) => {
        if (ok) {
          this.resetForm();
        } else {
          this.saveError.set("Échec de l'enregistrement");
        }
      });
  }

  getFormControlErrorText(ctrl: AbstractControl): string {
    if (ctrl.hasError('required')) return 'Ce champ est requis';
    if (ctrl.hasError('email')) return "Merci d'entrer une adresse mail valide";
    if (ctrl.hasError('minlength')) {
      return 'Ce numéro de téléphone ne contient pas assez de chiffres';
    }
    if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone contient trop de chiffres';
    }
    return 'Ce champ contient une erreur';
  }

  private initFormControls(): void {
    // personalInfo
    this.personalInfoForm = this.fb.group({
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
    });

    // contact preference + phone
    this.contactPreferenceCtrl = this.fb.control('email');
    this.phoneCtrl = this.fb.control('');

    // email
    this.emailCtrl = this.fb.control('');
    this.confirmEmailCtrl = this.fb.control('');
    this.emailForm = this.fb.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl,
    });

    // login
    this.passwordCtrl = this.fb.control('', Validators.required);
    this.confirmPasswordCtrl = this.fb.control('', Validators.required);
    this.loginInfoForm = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
    });

    // Signal à partir de valueChanges (avec émission initiale)
    this.contactPreference = toSignal(
      this.contactPreferenceCtrl.valueChanges.pipe(startWith(this.contactPreferenceCtrl.value)),
      { initialValue: this.contactPreferenceCtrl.value },
    );
  }

  private initMainForm(): void {
    this.mainForm = this.fb.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm,
    });
  }

  private initReactiveBehavior(): void {
    // Un seul endroit : affichage + validators dynamiques
    effect(
      () => {
        this.setEmailValidators(this.showEmail());
        this.setPhoneValidators(this.showPhone());
      },
      { injector: this.injector },
    );
  }

  private setEmailValidators(enabled: boolean): void {
    if (enabled) {
      this.emailCtrl.addValidators([Validators.required, Validators.email]);
      this.confirmEmailCtrl.addValidators([Validators.required, Validators.email]);
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
      // souvent plus propre quand on cache :
      this.emailForm.reset({ email: '', confirm: '' });
    }

    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  private setPhoneValidators(enabled: boolean): void {
    if (enabled) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else {
      this.phoneCtrl.clearValidators();
      // souvent plus propre quand on cache :
      this.phoneCtrl.reset('');
    }

    this.phoneCtrl.updateValueAndValidity();
  }

  private resetForm(): void {
    this.mainForm.reset({
      personalInfo: { firstName: '', lastName: '' },
      contactPreference: 'email',
      email: { email: '', confirm: '' },
      phone: '',
      loginInfo: { username: '', password: '', confirmPassword: '' },
    });
  }
}
