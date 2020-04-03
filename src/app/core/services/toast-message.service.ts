import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(private toastr: ToastrService) { }

  showToastMessageByType(type, message, options?) {
    if (options) {
      this.toastr[type](message['longMessage'], message['shortMessage'], options);
    } else {
      this.toastr[type](message['longMessage'], message['shortMessage']);
    }
  }
}
