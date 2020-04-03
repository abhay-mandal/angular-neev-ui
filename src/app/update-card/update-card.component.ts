import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppUtil } from '@app/app.util';
import { AppConstants } from '@app/app.constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styleUrls: ['./update-card.component.scss']
})
export class UpdateCardComponent implements OnInit {
  @Input() cardDetails: any;
  @Output() updateFormData: EventEmitter<any> = new EventEmitter<any>();
  updateCardFormData: FormGroup;
  RENDER_TYPES: any = AppConstants.RENDER_TYPES;
  // imageUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.updateCardForm(this.cardDetails);
  }

  updateCardForm(card) {
    this.updateCardFormData = this.formBuilder.group({
      cardName: new FormControl(card.cardName, [Validators.required, Validators.minLength(3), AppUtil.alphaNumericValidator]),
      cardContent: new FormControl(card.cardContent, [Validators.required, Validators.minLength(3)]),
      cardDesc: new FormControl(card.cardDesc, [Validators.required, Validators.minLength(5)]),
      renderType: new FormControl(card.renderType, [Validators.required]),
      imageUrl: new FormControl(card.imageUrl, [Validators.required])
    });
  }

  get form() { return this.updateCardFormData.controls; }

  // emit updated card details into Page container component
  updateCard() {
    this.updateFormData['cardName'] = this.form.cardName.value;
    this.updateFormData['cardDesc'] = this.form.cardDesc.value;
    this.updateFormData['cardContent'] = this.form.cardContent.value;
    this.updateFormData['renderType'] = this.form.renderType.value;
    this.updateFormData['imageUrl'] = this.form.imageUrl.value;
    this.updateFormData.emit(this.updateFormData);
  }

  // Recieves event from Upload File component
  uploadResponse(event) {
    this.cardDetails.imageUrl = event.downloadUrl;
    this.updateCardFormData.controls['imageUrl'].setValue(event.downloadUrl);
  }

  resetForm() {
    this.updateCardFormData.reset();
  }

}
