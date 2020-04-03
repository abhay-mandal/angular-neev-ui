import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppConstants } from '@app/app.constants';
import { ToastMessageService } from '@app/core/services/toast-message.service';
import { NeevService } from '@app/core/services/neev.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  fpFormData: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastMessageService: ToastMessageService,
    private neevService: NeevService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.fpFormData = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.fpFormData.controls; }

  forgotPassword() {
    const payload = { email: this.f.email.value, product: AppConstants.PRODUCT_NAME };
    this.neevService.forgotPassword(payload).subscribe(response => {
      if (response.httpStatus === AppConstants.STATUS_CODES.SUCCESS) {
        this.toastMessageService.showToastMessageByType(AppConstants.TOAST_MESSAGE_TYPES.SUCCESS, { 'shortMessage': "", 'longMessage': response.longMessage })
        this.router.navigate([AppConstants.APP_URLS.SIGN_IN]);
      }
    }, err => {
      // Show error message
    });
  }

}
