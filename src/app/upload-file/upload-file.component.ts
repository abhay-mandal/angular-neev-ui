import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppConstants } from '@app/app.constants';
import { CardsService } from '@app/core/services/cards.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @Input() cardId: number;
  @Output() uploadResponseObj: EventEmitter<any> = new EventEmitter<any>();

  uploadForm: FormGroup;
  IFA_FILE_EXTENSION = 'csv';
  MAX_FILE_SIZE = 200000000; // 200 MB in bytes
  uploadResponse: any = {};
  isUpload: any = {};
  formData = new FormData();
  fileName = '';

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private cardsService: CardsService,
  ) { }

  ngOnInit() {
    this.uploadCardForm();
  }

  uploadCardForm() {
    this.uploadForm = this.formBuilder.group({
      file: new FormControl('', [Validators.required])
    });
  }

  onUploadImgFile(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.fileName = file.name;
      this.formData.append(`file`, file, file.name);
      this.uploadForm.patchValue({
        file
      });
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
    }
  }

  onUploadImg() {
    return this.cardsService.uploadImg(this.formData, this.cardId)
      .subscribe(res => {
        this.uploadResponse = res;
        if (res.body && res['body']['httpStatus'] === AppConstants.STATUS_CODES.SUCCESS) {
          this.uploadResponseObj.emit(res.body.payload);
        }
      });
  }

}
