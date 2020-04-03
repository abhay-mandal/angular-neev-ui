import { Component, OnInit } from '@angular/core';
import { CardsService } from '@app/core/services/cards.service';
import { AppConstants } from '@app/app.constants';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@app/core/services/data.service';
import { MypageService } from '@app/core/services/mypage.service';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

export class CatalogComponent implements OnInit {
  cards = [];
  cardselectLabel = '';
  pageId: any;
  userDetails: object = {};
  readOnly: boolean;
  isPinCardAllowed = false;

  constructor(
    private cardsService: CardsService,
    private translate: TranslateService,
    private dataService: DataService,
    private mypageService: MypageService,
    private authService: AuthService,
    private router: Router
  ) {
    translate.get('catalog').subscribe((res) => {
      this.cardselectLabel = res.selectLabel;
    });
  }

  ngOnInit() {
    const currPath: string = this.router.url;
    if (currPath.includes(AppConstants.REQUEST_URL.PAGE)) {
      this.isPinCardAllowed = true;
    }
    this.userDetails['userId'] = this.authService.getLoggedInUserDetails()['email'];
    this.getAllCards();
    this.dataService.cards.subscribe((cards) => {
      this.cards = cards;
    });
    this.dataService.pageId.subscribe((pageId) => {
      this.pageId = pageId;
    });
    this.dataService.readOnly.subscribe(data => {
      this.readOnly = data;
    });
  }

  getAllCards() {
    this.cardsService.getAllCards().subscribe(data => {
      if (data.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        if (data.body.payload.length) {
          this.dataService.updateObservableAarrayObject(data.body.payload, 'cards');
        }
      }
    }, err => {
      this.cards = [];
    });
  }

  linkCardToPage(cardId) {
    const payload = { 'cardId': cardId, 'pageId': this.pageId };
    this.cardsService.linkCard(payload).subscribe((res) => {
      if (res.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.updateLinkedCards();
      }
    });
  }

  updateLinkedCards() {
    const queryParams = new HttpParams().set('pageId', this.pageId);
    this.mypageService.get(AppConstants.API_ENDPOINTS.PAGE, queryParams).subscribe(data => {
      if (data.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.dataService.updateObservableAarrayObject(data.body.payload.linkedCards, 'linkedCards');
      }
    });
  }

}
