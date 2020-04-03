import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';
import { AppConstants } from '@app/app.constants';
import { ActivatedRoute } from '@angular/router';
import { AppUtil } from '@app/app.util';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ToastMessageService } from '@app/core/services/toast-message.service';
import { NeevService } from '@app/core/services/neev.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPswdFormData: FormGroup;
  isPswdReset: boolean = false;

  resetPswdObj: any = {
    email: '',
    newPassword: '',
    resetPasswordCode: "",
    product: AppConstants.PRODUCT_NAME
  }
  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService, private toastMessageService: ToastMessageService, private neevService: NeevService) { }

  ngOnInit() {
    this.createForm();
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const resetPasswordCode = queryParams.get("resetPasswordCode");
      const email = queryParams.get("email");
      if (resetPasswordCode && email) {
        this.resetPswdObj.resetPasswordCode = resetPasswordCode;
        this.resetPswdObj.email = email;
      }
      else {
        //this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, AppUtil.getMessageByCode(AppConstants.NMM_MESSAGE_CODES.RESET_PWSD_ERROR).longMessage,)
      }
    })
  }

  createForm(): void {
    this.resetPswdFormData = this.formBuilder.group({
      'newPassword': new FormControl(this.resetPswdObj.password, [Validators.required, Validators.minLength(8)]),
      "confirmPassword": new FormControl("", Validators.required)
    },
      {
        validator: AppUtil.mustMatch('newPassword', 'confirmPassword')
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPswdFormData.controls; }

  resetPassword() {
    this.resetPswdObj.newPassword = this.resetPswdFormData.value.newPassword;
    let payload = this.resetPswdObj;
    this.neevService.resetPass(payload).subscribe(response => {
      if (response.httpStatus == AppConstants.STATUS_CODE.SUCCESS) {
        this.resetData();
        //Redirect to login page
        const message = { 'shortMessage': "", 'longMessage': response['longMessage'] };
        this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.SUCCESS, message);
        this.router.navigate([AppConstants.APP_URLS.SIGN_IN]);
      }
    }, err => {
      const message = { 'shortMessage': "", 'longMessage': err['longMessage'] }
      this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.ERROR, message)
    })
  }
  resetData() {
    this.resetPswdFormData.reset();
    this.isPswdReset = !this.isPswdReset;
  }

}
