import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';

import { AppConstants } from '@app/app.constants';
import { AppUtil } from '@app/app.util';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SignUpService } from './sign-up.service';
import { ToastMessageService } from '@app/core/services/toast-message.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({});
  renderForm: boolean = false;
  countryDropdownDefaultLabel;
  countryCodeMap = { "IND": '+91' };
  countryDropDownData = [];
  passwordStrengthColor = '';
  passwordStrengthColorSet: any = AppConstants.PASSWORD_STRENGTH_COLORS;
  showAlertMsg: boolean = false;
  isSignedUp: boolean = false;
  alert = {};
  messageLabels: any = {};
  subHeadingText: string = "";
  urlLabel: string = "";
  externalUrl: string = "";
  emailQueryParam = "";


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private translate: TranslateService,
    private signupService: SignUpService,
    private toastMessageService: ToastMessageService) {
    translate.get('sign_up').subscribe((res) => {
      this.countryDropdownDefaultLabel = res.select;
      this.messageLabels.verify_link_msg = res.verify_link_msg;
      this.messageLabels.signup_light_thank_you = res.signup_light_thank_you;
      this.messageLabels.signup_light_contact_you = res.signup_light_contact_you;
      this.initSignUpForm();
    });
    translate.get('login.labels').subscribe((res) => {
      this.messageLabels.back_to_sign_in = res.back_to_sign_in;
      this.initSignUpForm()
    });
  }

  ngOnInit() {
    let email = this.route.snapshot.queryParams['email']
    if (email) {
      this.emailQueryParam = email;
    }
    this.countryDropDownData = [
      { 'item_id': this.countryDropdownDefaultLabel, item_text: this.countryDropdownDefaultLabel }
    ];
    for (let key in AppConstants.COUNTRY_LIST) {
      this.countryDropDownData.push({ item_id: key, item_text: AppConstants.COUNTRY_LIST[key] });
    }
  }

  initSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, AppUtil.alphabetsValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    if (this.emailQueryParam) {
      this.signUpForm.controls['email'].setValue(AppUtil.replaceSpaceWithPlus(this.emailQueryParam))
    }
    this.renderForm = true;
  }

  setContactNumber() {
    this.signUpForm.controls['contactNumber'].setValue(this.countryCodeMap[this.signUpForm.controls['country'].value]);
  }

  signUp() {
    this.emailQueryParam = "";
    this.showAlertMsg = false;
    const message = { 'shortMessage': "", 'longMessage': "A message with a confirmation link has been sent to your email address. Please follow the link to activate your account." };

    const payload = {
      "name": this.signUpForm.controls['name'].value,
      "email": this.signUpForm.controls['email'].value,
      "password": this.signUpForm.controls['password'].value,
      "product": AppConstants.PRODUCT_NAME,
    };
    this.signupService.signup(payload).subscribe(response => {
      if (response.httpStatus == AppConstants.STATUS_CODE.SUCCESS) {
        //Redirect to login page
        // const message = { 'shortMessage': "", 'longMessage': response['longMessage'] };
        this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.SUCCESS, message);
        this.router.navigate([AppConstants.APP_URLS.SIGN_IN]);
      }
    }, err => {
      const message = { 'shortMessage': "", 'longMessage': err['longMessage'] };
      this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, message);
    })
  }

  initFormAndViewChange() {
    this.initSignUpForm();
    this.isSignedUp = !this.isSignedUp;
  }

  checkPaswordStrength(value) {
    this.passwordStrengthColor = AppUtil.getPaswordStrengthColor(value);
  }
}