import {

    HttpEvent,

    HttpInterceptor,

    HttpHandler,

    HttpRequest,

    HttpResponse,

    HttpErrorResponse

} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)

            .pipe(

                retry(1),

                catchError((error: HttpErrorResponse) => {

                    let errorMessage: string;

                    if (error.error instanceof ErrorEvent) {

                        // client-side error

                        errorMessage = `Error: ${error.error.message}`;


                    } else {

                        // server-side error

                        errorMessage = `Error Code: ${error.status}\nMessage: ${this.getServerErrorMessage(error)}}`;

                    }

                    // window.alert(errorMessage);

                    return throwError(() => errorMessage);

                })

            )

    }
    private getServerErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.message}`;
            }
            case 403: {
                return `Access Denied: ${error.message}`;
            }
            case 500: {
                return `Internal Server Error: ${error.message}`;
            }
            default: {
                return `Unknown Server Error: ${error.message}`;
            }

        }
    }
}