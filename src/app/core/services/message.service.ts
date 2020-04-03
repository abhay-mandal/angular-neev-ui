import { Injectable } from '@angular/core';

import { HttpService } from '@app/core/services/http.service';
import { AppConstants } from '@app/app.constants';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  MESSAGE_URL = environment.WEBSOCKET_HOST;

  constructor(private httpService: HttpService) { }

  readMessage(messageId) {
    return this.httpService.put(`${this.MESSAGE_URL}${AppConstants.API_ENDPOINTS.READ_MESSAGE}${messageId}`, {});
  }

}
