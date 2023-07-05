import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { clientStorage } from "src/app/Core/ClientStorage";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private readonly route: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = req.headers;

    headers = headers.append('Content-type', 'application/json');

    let authToken = clientStorage.getAuthenticationToken() ?? '';

    if (authToken != '') {
      headers = headers.append('ClientTimeZone', Intl.DateTimeFormat().resolvedOptions().timeZone)
    }
    else{
      headers = headers.append('Authorization', '');
    }

    const authReq = req.clone({headers: headers});

    return next.handle(authReq).pipe(
      tap(
        () => {},
      (err: any) => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.route.navigateByUrl( '/'); // LOGIN PATH
            clientStorage.removeUserData();
          }
        }
      })
    )
  }
}
