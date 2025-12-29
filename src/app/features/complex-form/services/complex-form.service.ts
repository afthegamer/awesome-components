import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ComplexFormValue } from '../models/complex-form-value.model';

@Injectable()
export class ComplexFormService {
  private readonly http = inject(HttpClient);

  saveUserInfo(formValue: ComplexFormValue): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/users`, formValue).pipe(
      map(() => true),
      delay(1000),
      catchError(() => of(false).pipe(delay(1000))),
    );
  }
}
