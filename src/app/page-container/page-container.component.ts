import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MypageService } from '@app/core/services/mypage.service';
import { AppConstants } from '@app/app.constants';
import { HttpParams } from '@angular/common/http';
import { PageContainerService } from './page-container.service';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@app/core/services/data.service';
import { CardsService } from '@app/core/services/cards.service';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationsService } from '@app/core/services/notifications.service';
import { UpdateCardComponent } from '@app/update-card/update-card.component';
import { CatalogService } from '@app/core/services/catalog.service';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss']
})

export class PageContainerComponent implements OnInit, OnDestroy {
  pageId: string;
  pageDetails: any = [];
  cards: any = [];
  pageName: FormControl = new FormControl();
  modalRef: any;
  DEFAULT_PAGE_ID = AppConstants.DEFAULT_PAGE_ID;
  shareUserId: FormControl = new FormControl('', [Validators.required]); // Validators.maxLength(50)
  userDetails: object = {};
  cardDetails: object = {};
  readOnly: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mypageService: MypageService,
    private pageService: PageContainerService,
    private modalService: NgbModal,
    private dataService: DataService,
    private cardsService: CardsService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private catalogServ: CatalogService
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.catalogServ.show();
    }, 0);
    this.activatedRoute.paramMap.subscribe(params => {
      this.pageId = params.get('pageId');
      this.dataService.updateObservableAarrayObject(this.pageId, 'pageId');
      this.getPageDetails(this.pageId);
    });
    this.dataService.linkedCards.subscribe((cards) => {
      if (cards) {
        this.cards = cards;
      }
    });
    this.userDetails['userId'] = this.authService.getLoggedInUserDetails()['email'];
    this.dataService.readOnly.subscribe(data => {
      this.readOnly = data;
    });
  }

  getPageDetails(pageId) {
    const queryParams = new HttpParams().set('pageId', pageId);
    this.mypageService.get(AppConstants.API_ENDPOINTS.PAGE, queryParams).subscribe(data => {
      if (data.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.dataService.updateObservableAarrayObject(data.body.payload.linkedCards, 'linkedCards');
        this.pageDetails = data.body.payload;
        this.hasReadOnlyAccess(this.pageDetails.readOnly);
      }
    });
  }

  hasReadOnlyAccess(readOnly) {
    this.dataService.updateObservableAarrayObject(readOnly, 'readOnly');
  }

  openClonePageModal(clonePageNameModalContent) {
    this.pageName.reset();
    this.pageName.setValue(this.pageDetails.pageName);
    this.modalRef = this.modalService.open(clonePageNameModalContent, { windowClass: 'page-modal', backdrop: 'static' });
  }

  openSharePageModal(sharePageNameModalContent) {
    this.shareUserId.reset();
    this.pageName.setValue(this.pageDetails.pageName);
    this.modalRef = this.modalService.open(sharePageNameModalContent, { windowClass: 'page-modal', backdrop: 'static' });
  }

  clonePage() {
    const payload = {};
    payload['pageId'] = this.pageId;
    payload['pageName'] = this.pageName.value;
    payload['userId'] = this.userDetails['userId'];
    this.pageService.clonePage(payload)
      .subscribe(response => {
        if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.updatePages(response.payload);
          this.pageName.reset();
          this.modalRef.close();
        }
      },
        err => {
          console.log(err);
        });
  }

  sharePage() {
    const payload = {};
    payload['pageId'] = this.pageId;
    payload['pageName'] = this.pageDetails['pageName'];
    payload["userId"] = this.userDetails['userId'];
    payload['shareUserId'] = [];
    payload['shareUserId'] = [...this.shareUserId.value.split(',')];
    this.pageService.sharePage(payload)
      .subscribe(response => {
        if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.notificationsService.sendPageShareNotification(payload['userId'], payload['shareUserId'], payload['pageId']);
          this.shareUserId.reset();
          this.modalRef.close();
        }
      });
  }

  updatePages(data) {
    this.dataService.addElementToObservableArray(data, 'pages');
  }

  unPinCardFromPage(id) {
    const payload = { cardId: id, pageId: this.pageId };
    this.cardsService.unLinkCard(payload).subscribe((res) => {
      if (res.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.deleteElement(res.body.payload.pageId, 'linkedCards', 'cardId');
      }
    });
  }

  updateLinkedCards() {
    const queryParams = new HttpParams().set('pageId', this.pageId);
    this.mypageService.delete(AppConstants.API_ENDPOINTS.PAGE, queryParams).subscribe(data => {
      if (data.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.deleteElement(data.payload.pageId, 'pages', 'pageId');
        this.redirectToHome();
      }
    });
  }

  deletePage() {
    const queryParams = new HttpParams().set('pageId', this.pageId);
    this.mypageService.delete(AppConstants.API_ENDPOINTS.PAGE, queryParams).subscribe(data => {
      if (data.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.deleteElement(data.payload.pageId, 'pages', 'pageId');
        this.redirectToHome();
      }
    });
  }

  rateCardFromPage(cardDetails) {
    const payload = { 'cardId': cardDetails.cardId, 'cardRate': cardDetails.rating };
    this.cardsService.rateCard(payload).subscribe((res) => {
      if (res.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.updateObjElement(res.body.payload, 'linkedCards', 'cardRate');
      }
    });
  }

  updateObjElement(data, key, eleKey) {
    this.dataService.updateElementToObservableArrayOfArray(data, key, eleKey, 'cardId');
  }

  redirectToHome() {
    this.authService.redirectToHome();
  }

  updateCardModal(card) {
    this.cardDetails = card;
    this.modalRef = this.modalService.open(UpdateCardComponent, { size: 'lg', windowClass: 'update-card-modal' });
    this.modalRef.componentInstance.cardDetails = this.cardDetails;
    this.modalRef.componentInstance.updateFormData.subscribe((updatedCard) => {
      this.updateCard(updatedCard);
    });
  }

  updateCard(card) {
    const payload = {};
    payload['cardId'] = this.cardDetails['cardId'];
    payload['cardName'] = card.cardName;
    payload['cardDesc'] = card.cardDesc;
    payload['cardContent'] = card.cardContent;
    payload['renderType'] = card.renderType;
    payload['userId'] = this.cardDetails['userId'];
    payload['imageUrl'] = this.cardDetails['imageUrl'];
    payload['cardRate'] = this.cardDetails['cardRate'];
    // proxyUrl

    this.cardsService.updateCard(payload)
      .subscribe(data => {
        if (data.body.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.updateElemet(data.body.payload, 'cards');
          this.updateElemet(data.body.payload, 'linkedCards');
          this.modalRef.close();
        }
      });
  }

  deleteElement(pageId, objKey, key) {
    this.dataService.deleteArrayObjectById(pageId, objKey, key);
  }

  updateElemet(data, key) {
    this.dataService.updateElementToObservableArray(data, key, 'cardId');
  }

  ngOnDestroy() {
    this.catalogServ.hide();
  }

}
