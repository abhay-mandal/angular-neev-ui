import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppConstants } from '@app/app.constants';
import { AppUtil } from '@app/app.util';
import { DataService } from '@app/core/services/data.service';
import { AuthService } from '@app/core/services/auth.service';
import { CardsService } from '@app/core/services/cards.service';
import { CatalogService } from '@app/core/services/catalog.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss'],
})
export class CreateCardComponent implements OnInit, OnDestroy {

  createCardForm: FormGroup;
  RENDER_TYPES: any = AppConstants.RENDER_TYPES;
  userDetails: object = {};

  constructor(
    private formBuilder: FormBuilder,
    private cardService: CardsService,
    private dataService: DataService,
    private authService: AuthService,
    private catalogServ: CatalogService
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.catalogServ.show();
    }, 0);
    this.userDetails['userId'] = this.authService.getLoggedInUserDetails()['email'];
    this.createForm();
  }

  createForm(): void {
    this.createCardForm = this.formBuilder.group({
      cardName: new FormControl('', [Validators.required, Validators.minLength(3), AppUtil.alphaNumericValidator]),
      cardContent: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cardDesc: new FormControl('', [Validators.required, Validators.minLength(5)]),
      renderType: new FormControl('', [Validators.required])
    });
  }

  get form() { return this.createCardForm.controls; }

  resetForm() {
    this.createCardForm.reset();
  }

  createCard() {
    const payload = {};
    payload['cardContent'] = this.createCardForm.value.cardContent;
    payload['cardDesc'] = this.createCardForm.value.cardDesc;
    payload['cardName'] = this.createCardForm.value.cardName;
    payload['favorite'] = false;
    payload['renderType'] = this.createCardForm.value.renderType;
    payload['userId'] = this.userDetails['userId'];
    this.cardService.createcard(payload)
      .subscribe(response => {
        if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.resetForm();
          this.updateCards(response.payload);
        }
      });
  }

  updateCards(data) {
    this.dataService.addElementToObservableArray(data, 'cards');
  }
  ngOnDestroy() {
    this.catalogServ.hide();
  }

}
