import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})

export class CardContainerComponent implements OnInit {

  @Input() cards: any;
  @Input() readOnly: boolean;
  @Output() unPinCardFromPage: EventEmitter<string> = new EventEmitter<string>();
  @Output() cloneCardFromPage: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateCard: EventEmitter<string> = new EventEmitter<string>();
  @Output() rateCardFromPage: EventEmitter<any> = new EventEmitter<any>();

  rating = new FormControl(null, Validators.required);
  modalRef: any;

  constructor(
    config: NgbRatingConfig,
    private modalService: NgbModal) {
    config.max = 5;
  }

  ngOnInit() {
  }

  updateRating(cardId, rating) {
    this.rateCardFromPage.emit({ cardId, rating });
  }

  redirectToUrl(content) {
    window.open(content);
  }

  unPinCard(cardId) {
    this.unPinCardFromPage.emit(cardId);
    // event.stopPropagation();
  }

  updateCardDetail(card) {
    this.updateCard.emit(card);
  }

  renderInternal(internalRenderModalContent) {
    this.modalRef = this.modalService.open(internalRenderModalContent, { size: 'lg', windowClass: 'internal-modal' });
  }

}