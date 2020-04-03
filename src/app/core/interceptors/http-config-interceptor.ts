import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastMessageService } from '../services/toast-message.service';
import { AppConstants } from '@app/app.constants';

@Injectable()
export class HTTPConfigInterceptor implements HttpInterceptor {

    constructor(private toastMsgService: ToastMessageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Uncomment below to pass headers and a check when not to send.
        let headers = request.headers
            .set('Content-Type', AppConstants.AUTH_DATA.APP_JSON_CONTENT_TYPE)
            .set('Access-Control-Allow-Origin', AppConstants.AUTH_DATA.CORS);
        let updatedRequest = request.clone({ headers });
        if (request.url.includes(AppConstants.API_ENDPOINTS.UPLOAD_IMG_FILE)) {
            // headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
            headers = new HttpHeaders();
            updatedRequest = request.clone({ headers });
        }

        return next.handle(updatedRequest).pipe(
            tap((event: HttpEvent<any>) => {
            // Uncomment below code to show toast messages for success responses.
            if (event instanceof HttpResponse && event.status === 200) {
                const apiUrlShowingInlineMessages = AppConstants.API_URLS_SHOWING_INLINE_MESSAGES;
                if (!apiUrlShowingInlineMessages.find( element => event.url.indexOf(element) > -1))  {
                    if (event.body && (event['body']['messageType'] != AppConstants.HTTP_MESSAGE_TYPE.INFO) &&
                            event['body']['shortMessage'] && event['body']['longMessage']) {
                        const messageType = event['body']['messageType'];
                        const message = { 'shortMessage': event['body']['shortMessage'], 'longMessage': event['body']['longMessage']}
                        if (messageType === AppConstants.HTTP_MESSAGE_TYPE.CONFIRM) {
                            this.toastMsgService.showToastMessageByType(AppConstants.ALERT_TYPE.SUCCESS, message);
                        } else if (messageType === AppConstants.HTTP_MESSAGE_TYPE.WARN) {
                            this.toastMsgService.showToastMessageByType(AppConstants.ALERT_TYPE.WARN, message);
                        }
                    }
                }
            }
        }));
    }
}