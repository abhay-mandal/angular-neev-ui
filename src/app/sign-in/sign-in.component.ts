import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SignInService } from './sign-in.service';
import { AppConstants } from '@app/app.constants';
import { AuthService } from '@app/core/services/auth.service';
import { ToastMessageService } from '@app/core/services/toast-message.service';
import { ActivatedRoute } from '@angular/router';
import { AppUtil } from '@app/app.util';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  logInFormData: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private signInService: SignInService,
    private authService: AuthService,
    private router: Router,
    private toastMessageService: ToastMessageService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const verificationCode = queryParams.get('verificationCode');
      if (verificationCode) {
        this.verifyUserCode(verificationCode, queryParams.get('email'));
      }
    });
    this.createForm();
  }

  createForm(): void {
    this.logInFormData = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      rememberMe: new FormControl('')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.logInFormData.controls; }

  signIn() {
    const payload = { email: this.f.email.value, password: this.f.password.value, product: AppConstants.PRODUCT_NAME };
    this.signInService.signIn(payload).subscribe(response => {
      if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS && response.payload) {
        this.authService.setToken(response.payload[AppConstants.AUTH_KEYS.TOKEN]);
        this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.SUCCESS, { shortMessage: response.shortMessage, longMessage: response.longMessage });
        // Redirect to dashboard page
        this.authService.redirectToHome();
      }
    }, err => {
    });
  }
  verifyUserCode(verificationCode, email) {
    const payload = {
      product: AppConstants.PRODUCT_NAME,
      verificationCode
    }
    this.signInService.verifyUser(payload).subscribe(data => {
      if (data.httpStatus === AppConstants.STATUS_CODE.SUCCESS) {
        if (email) {
          email = AppUtil.replaceSpaceWithPlus(email);
          this.logInFormData.controls['email'].setValue(email);
        }
        const message = { shortMessage: '', longMessage: data['longMessage'] };
        this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.SUCCESS, message);
      }
    }, err => {
      const message = { shortMessage: '', longMessage: err['longMessage'] };
      this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, message);
    });
  }

}
