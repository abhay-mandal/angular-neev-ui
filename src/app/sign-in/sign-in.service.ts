import { Injectable } from '@angular/core';

import { NeevService } from '@app/core/services/neev.service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private neevService: NeevService) { }

  signIn(payload) {
    return this.neevService.authenticate(payload);
  }

  verifyUser(payload) {
    return this.neevService.verify(payload);
  }

}
