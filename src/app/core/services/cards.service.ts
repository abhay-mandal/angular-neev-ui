import { Injectable } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { MypageService } from '@app/core/services/mypage.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private mypageService: MypageService) { }

  createcard(payload) {
    return this.mypageService.post(AppConstants.API_ENDPOINTS.CARD, payload);
  }

  getAllCards() {
    return this.mypageService.get(AppConstants.API_ENDPOINTS.GET_ALL_CARDS);
  }

  getCardById(cardId) {
    const queryParams = new HttpParams().set('cardId', cardId);
    return this.mypageService.get(AppConstants.API_ENDPOINTS.CARD, queryParams);
  }

  linkCard(payload) {
    return this.mypageService.put(AppConstants.API_ENDPOINTS.LINK_CARD, payload);
  }

  unLinkCard(payload) {
    return this.mypageService.put(`${AppConstants.API_ENDPOINTS.UNLINK_CARD}`, payload);
  }

  updateCard(payload) {
    return this.mypageService.put(AppConstants.API_ENDPOINTS.CARD, payload);
  }

  uploadImg(payload, cardId) {
    return this.mypageService.post(`${AppConstants.API_ENDPOINTS.UPLOAD_IMG_FILE}${cardId}`, payload, { reportProgress: true, observe: 'events' });
  }

  rateCard(payload){
    return this.mypageService.put(AppConstants.API_ENDPOINTS.RATE_CARD,payload);
  }

}
