import { Injectable } from '@angular/core';

import { HttpService } from '@app/core/services/http.service';
import { AppConstants } from '@app/app.constants';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class NeevService {
  NEEV_URL = environment.NEEV_URL;

  constructor(private httpService: HttpService) { }

  authenticate(payload) {
    return this.httpService.post(`${this.NEEV_URL}${AppConstants.API_ENDPOINTS.AUTH.SIGN_IN}`, payload);
  }

  signup(payload) {
    return this.httpService.post(`${this.NEEV_URL}${AppConstants.API_ENDPOINTS.AUTH.SIGN_UP}`, payload);
  }

  verify(payload) {
    return this.httpService.post(`${this.NEEV_URL}${AppConstants.API_ENDPOINTS.AUTH.VERIFY_EMAIL}`, payload);
  }

  forgotPassword(payload) {
    return this.httpService.post(`${this.NEEV_URL}${AppConstants.API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, payload);
  }

  resetPass(payload) {
    return this.httpService.post(`${this.NEEV_URL}${AppConstants.API_ENDPOINTS.AUTH.RESET_PASSWORD}`, payload);
  }

}
