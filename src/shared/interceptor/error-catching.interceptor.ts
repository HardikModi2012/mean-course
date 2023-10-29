import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of, throwError, timer} from 'rxjs';
import {AuthService} from '../services/auth.service';
import { mergeMap, retryWhen, catchError } from "rxjs/operators";

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  retryDelay = 3000;
  retryMaxAttempts = 3;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(this.retryAfterDelay(), this.errorHandling());
  }

  errorHandling(): any {
    return catchError((error: HttpErrorResponse) => {
      try {
        switch (error.status) {
          case 401:
            this.router.navigate(['/error/401'], {queryParams: {error: JSON.stringify(error)}});
            break;

          case 403:
            this.router.navigate(['/error/403'], {queryParams: {error: JSON.stringify(error)}});
            break;

          case 404:
            this.router.navigate(['/error/404'], {queryParams: {error: JSON.stringify(error)}});
            break;

          case 405:
            this.router.navigate(['/error/405'], {queryParams: {error: JSON.stringify(error)}});
            break;

          case 408:
            this.router.navigate(['/error/408'], {queryParams: {error: JSON.stringify(error)}});
            break;
        }
      } catch (e) {}

      return throwError(error);
    });
  }

  retryAfterDelay(): any {
    return retryWhen((errors: any) => {
      return errors.pipe(
        mergeMap((err: any, count: number) => {
          // throw error when we've retried ${retryMaxAttempts} number of times and still get an error
          if (this.skipRetry(err) || count === this.retryMaxAttempts) {
            return throwError(err);
          }

          return of(err).pipe(
            // tap((error) => this.ds.showNotification({content: `Retrying ${error.url}. Retry count ${count + 1}`, type: 'warning'})),
            mergeMap(() => timer(this.retryDelay))
          );
        })
      );
    });
  }

  skipRetry(error: any): boolean {
    if (error?.error?.message === 'PRECONDITION_FAILED_DIVISION_OR_LOCATION_REQUIRED') {
      this.authService.openDivisionOrLocationPopup();
      error.error.message = 'Division and Location Not Found Please enter again';
      return true;
    }
    if ([500, 408].includes(error.status)) {
      return false;
    }
    return true;
  }
}
