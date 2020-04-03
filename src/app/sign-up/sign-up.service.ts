import { Injectable } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { NeevService } from '@app/core/services/neev.service';


@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private neevService: NeevService) { }

  signup(payload) {
    return this.neevService.signup(payload);
  }

}
