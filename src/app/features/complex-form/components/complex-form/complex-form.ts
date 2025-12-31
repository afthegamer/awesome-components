import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, startWith } from 'rxjs';

import { ComplexFormService } from '../../services/complex-form.service';
import { ComplexFormValue } from '../../models/complex-form-value.model';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';
import { validValidator } from '../../validators/valid.validator';

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
export class ComplexForm implements OnInit {
  // UI state
  readonly isSaving = signal(false);
  readonly saveError = signal<string | null>(null);

  // Affichage (signals)
  readonly contactPreference = signal<ContactPreference>('email');
  readonly showEmail = computed(() => this.contactPreference() === 'email');
  readonly showPhone = computed(() => this.contactPreference() === 'phone');

  // Erreurs “FormGroup-level”
  readonly showEmailError = signal(false);
  readonly showPasswordError = signal(false);

  // Forms
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

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(ComplexFormService);

  /**
   * Optionnel : active uniquement si tu veux tester validValidator() sur le champ email.
   * Laisse false en temps normal.
   */
  private readonly enableValidDemo = false;

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initReactiveBehavior(); // show/hide + validators dynamiques
    this.initGroupErrorSignals(); // messages d'erreur confirmEqual
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
    if (ctrl.hasError('minlength'))
      return 'Ce numéro de téléphone ne contient pas assez de chiffres';
    if (ctrl.hasError('maxlength')) return 'Ce numéro de téléphone contient trop de chiffres';
    // if (ctrl.hasError('validValidator')) return 'Ce texte ne contient pas le mot VALID';
    return 'Ce champ contient une erreur';
  }

  private initFormControls(): void {
    this.personalInfoForm = this.fb.group({
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
    });

    this.contactPreferenceCtrl = this.fb.control<ContactPreference>('email');
    this.phoneCtrl = this.fb.control('');

    this.emailCtrl = this.fb.control('');
    this.confirmEmailCtrl = this.fb.control('');

    this.emailForm = this.fb.group(
      {
        email: this.emailCtrl,
        confirm: this.confirmEmailCtrl,
      },
      {
        validators: [confirmEqualValidator('email', 'confirm')],
        updateOn: 'blur',
      },
    );

    this.passwordCtrl = this.fb.control('', Validators.required);
    this.confirmPasswordCtrl = this.fb.control('', Validators.required);

    this.loginInfoForm = this.fb.group(
      {
        username: this.fb.control('', Validators.required),
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
      },
      {
        validators: [confirmEqualValidator('password', 'confirmPassword')],
      },
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
    this.contactPreferenceCtrl.valueChanges
      .pipe(startWith(this.contactPreferenceCtrl.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((pref) => {
        this.contactPreference.set(pref);

        this.setEmailValidators(pref === 'email');
        this.setPhoneValidators(pref === 'phone');
      });
  }

  private initGroupErrorSignals(): void {
    this.emailForm.statusChanges
      .pipe(startWith(this.emailForm.status), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showEmailError.set(
          this.emailForm.hasError('confirmEqual') &&
            !!this.emailCtrl.value &&
            !!this.confirmEmailCtrl.value,
        );
      });

    this.loginInfoForm.statusChanges
      .pipe(startWith(this.loginInfoForm.status), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showPasswordError.set(
          this.loginInfoForm.hasError('confirmEqual') &&
            !!this.passwordCtrl.value &&
            !!this.confirmPasswordCtrl.value,
        );
      });
  }

  private setEmailValidators(enabled: boolean): void {
    if (enabled) {
      const base = [Validators.required, Validators.email];
      this.emailCtrl.setValidators(this.enableValidDemo ? [...base, validValidator()] : base);
      this.confirmEmailCtrl.setValidators([Validators.required, Validators.email]);
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
      this.emailForm.reset({ email: '', confirm: '' });
    }

    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
    this.emailForm.updateValueAndValidity();
  }

  private setPhoneValidators(enabled: boolean): void {
    if (enabled) {
      this.phoneCtrl.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else {
      this.phoneCtrl.clearValidators();
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

    // remet l'état initial + déclenche l'affichage/validators
    this.contactPreferenceCtrl.setValue('email', { emitEvent: true });
    this.saveError.set(null);
  }
}
