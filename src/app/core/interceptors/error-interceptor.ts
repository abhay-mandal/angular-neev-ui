import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastMessageService } from '@app/core/services/toast-message.service';
import { AppConstants } from '@app/app.constants';
import { AuthService } from '../services/auth.service';

// import { AuthService } from '@app/core/services/auth.service';
// import { ToastMsgService } from '@app/core/services/toastr-msg.service';
// import { AppConstant } from '@app/app.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    INTERNAL_SERVER_HTTP_ERROR_CODE = 500;
    UNAUTHORISED_SERVER_HTTP_ERROR_CODE = 401;

    constructor(
        private router: Router,
        private toastMsg: ToastMessageService,
        private authenticationService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    const apiUrlShowingInlineMessages = [];
                    if (!apiUrlShowingInlineMessages.find(element => request.url.indexOf(element) > -1)) {
                        const errorStatus = error.status;
                        switch (errorStatus) {
                            case this.UNAUTHORISED_SERVER_HTTP_ERROR_CODE:
                                if (error['error']['message']) {
                                    this.toastMsg.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, error['error']['message']);
                                } else if (error['error']['shortMessage'] && error['error']['longMessage']) {
                                    const message = { 'shortMessage': error['error']['shortMessage'], 'longMessage': error['error']['longMessage'] }
                                    this.toastMsg.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, message);
                                }
                                this.authenticationService.logOut();
                                break;
                            case this.INTERNAL_SERVER_HTTP_ERROR_CODE:
                                this.router.navigate([]);
                                break;
                            default:
                                if (error['error']['shortMessage'] && error['error']['longMessage']) {
                                    const message = { 'shortMessage': error['error']['shortMessage'], 'longMessage': error['error']['longMessage'] }
                                    if (error['error']['messageType'] == AppConstants.HTTP_MESSAGE_TYPE.ERROR) {
                                        this.toastMsg.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, message);
                                    } else if (error['error']['messageType'] == AppConstants.HTTP_MESSAGE_TYPE.WARN) {
                                        this.toastMsg.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.WARN, message);
                                    }
                                }
                                break;
                        }
                    }
                    return throwError(error);
                })
            );
    }
}
