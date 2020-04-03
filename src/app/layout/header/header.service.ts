import { Injectable } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { MypageService } from '@app/core/services/mypage.service';
import { MessageService } from '@app/core/services/message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

  constructor(private mypageService: MypageService,private messageService: MessageService,
    private router: Router
  ) {
  }

  getAllPages(params) {
    return this.mypageService.get(AppConstants.API_ENDPOINTS.GET_ALL_PAGES, params);
  }

  redirectByPageId(pageId) {
    this.router.navigate([`${AppConstants.APP_URLS.PAGE}/${pageId}`]);
  }

  readMessage(messageId) {
    return this.messageService.readMessage(messageId);
  }
}
