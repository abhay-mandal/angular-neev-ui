import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class MypageService {
  BASE_URL = environment.MYPAGE_URL;

  constructor(private httpService: HttpService) { }

  post(path, payload, eventType?) {
    if (eventType) {
      return this.httpService.post(`${this.BASE_URL}${path}`, payload, eventType);
    }
    return this.httpService.post(`${this.BASE_URL}${path}`, payload);
  }

  get(path, params?) {
    return this.httpService.get(`${this.BASE_URL}${path}`, params);
  }

  put(path, payload) {
    return this.httpService.put(`${this.BASE_URL}${path}`, payload);
  }

  delete(path, params?) {
    return this.httpService.delete(`${this.BASE_URL}${path}`, params);
  }

}

