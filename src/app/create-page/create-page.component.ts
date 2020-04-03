import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppConstants } from '@app/app.constants';
import { AppUtil } from '@app/app.util';
import { DataService } from '@app/core/services/data.service';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { MypageService } from '@app/core/services/mypage.service';
import { CatalogService } from '@app/core/services/catalog.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit, OnDestroy {

  createPageForm: FormGroup;
  userDetails: object = {};

  constructor(
    private formBuilder: FormBuilder,
    private mypageService: MypageService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
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
    this.createPageForm = this.formBuilder.group({
      'pageName': new FormControl('', [Validators.required, Validators.minLength(3), AppUtil.alphaNumericValidator]),
      'pageDesc': new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  get form() { return this.createPageForm.controls; }

  resetForm() {
    this.createPageForm.reset();
  }

  createPage() {
    const payload = {};
    payload['pageDesc'] = this.createPageForm.value.pageDesc;
    payload['pageName'] = this.createPageForm.value.pageName;
    payload['linkedCardIds'] = [];
    payload['userId'] = this.userDetails['userId'];
    this.mypageService.post(AppConstants.API_ENDPOINTS.PAGE, payload)
      .subscribe(response => {
        if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
          this.resetForm();
          this.updatePage(response.payload);
        }
      });
  }

  updatePage(data) {
    this.dataService.addElementToObservableArray(data, 'pages');
    this.router.navigate([`${AppConstants.REQUEST_URL.PAGE}${data.pageId}`]);
  }

  ngOnDestroy() {
    this.catalogServ.hide();
  }

}
