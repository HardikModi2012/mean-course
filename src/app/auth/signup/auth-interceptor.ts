import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{ 
    constructor(private authS: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authS.getToken();
        const authReq = req.clone({
            headers: req.headers.set("Authorization","Bearer "+ authToken)
        });
         return next.handle(authReq);
    }
}