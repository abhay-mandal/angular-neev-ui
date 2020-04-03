import { Injectable } from '@angular/core';
import { MypageService } from '@app/core/services/mypage.service';
import { AppConstants } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PageContainerService {

  constructor(private mypageService: MypageService) { }

  clonePage(payload) {
    return this.mypageService.post(AppConstants.API_ENDPOINTS.CLONE_PAGE, payload);
  }

  sharePage(payload) {
    return this.mypageService.post(AppConstants.API_ENDPOINTS.SHARE_PAGE, payload);
  }

}
