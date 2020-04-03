import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  logoutOnClearToken;

  constructor(private router: Router, private dataService: DataService) { }

  setToken(token) {
    localStorage.setItem(AppConstants.AUTH_KEYS.TOKEN, token);
    this.dataService.setDecodedToken(jwt_decode(token));
  }

  /**
   * This method clears sesssion storage, data service and redirects to login page. 
   */
  logOut() {
    this.dataService.reset();
    localStorage.clear();
    clearInterval(this.logoutOnClearToken);
    this.redirectToLogIn();
  }

  redirectToLogIn() {
    this.router.navigate([AppConstants.APP_URLS.SIGN_IN]);
  }

  /**
   * This method return true when a passed URL is allowed to access for a logged in user else false. 
   * It looks for passed UI URL rule in JWT token.
   * @param redirectingUrl String Application URL
   * @return true if user is allowed to redirect to passed URL else false.
   */
  isRedirectingUrlAllowed(redirectingUrl) {
    let isUserAllowed = false;
    const decodedToken = this.getToken();
    const authorizationRules = decodedToken['acls'][0]['rules']
    authorizationRules['ui'].forEach(uiRule => {
      if (uiRule) {
        const ruleRegex = new RegExp(uiRule['rule']);
        if (ruleRegex.test(redirectingUrl)) {
          isUserAllowed = true;
        }
      }
    });
    return isUserAllowed;
  }

  /**
   * This method return true when a passed field is allowed to see for a logged in user in a passed URL else false. 
   * It looks for passed field in URL rule in JWT token. 
   * @param pageUrl String URL whose 'doNotShow' field test is used to check
   * @param fieldName String Name of the field which must be not part of 'doNotShow' list
   * @return true if user is allowed to see field in a passed URL rule else false.
   */
  isLoggedInUserAllowedToSeeFieldInPage(pageUrl, fieldName) {
    let isAllowed = false;
    const decodedToken = this.getToken();
    const authorizationRules = decodedToken['acls'][0]['rules'];
    if (authorizationRules != null) {
      const uiRules = authorizationRules['ui'];
      for (let index = 0; index < uiRules.length; index++) {
        const rule = uiRules[index]['rule'];
        if (rule.indexOf(pageUrl) > -1) {
          if (uiRules[index]['doNotShow'] == null || uiRules[index]['doNotShow'].indexOf(fieldName) == -1) {
            isAllowed = true;
            break;
          }
        }
      }
    }
    return isAllowed;
  }

  /**
   * This method sends true if JWT token is saved in session storage else it sends false.
   * @returns true if token is available else false.
   */
  isUserLoggedIn() {
    return localStorage.getItem(AppConstants.AUTH_KEYS.TOKEN) != null ? true : false;
  }

  /**
   * This method returns decoded token from data service if it's present else decodes 
   * it by reading it from session. 
   */
  getToken() {
    return this.dataService.getDecodedToken().length > 0 ? this.dataService.getDecodedToken() : jwt_decode(localStorage.getItem(AppConstants.AUTH_KEYS.TOKEN));
  }

  getLoggedInUserTenantCode() {
    const decodedToken = this.getToken();
    return decodedToken['currentTenant']['code'];
  }

  getLoggedInUserDetails() {
    const decodedToken = this.getToken();
    return decodedToken['userProfile'];
  }

  getEncodedToken() {
    return localStorage.getItem(AppConstants.AUTH_KEYS.TOKEN);
  }

  redirectToHome() {
    if (localStorage.getItem("redirectUrlMyPage")) {
      this.router.navigate([localStorage.getItem("redirectUrlMyPage")]);
      localStorage.removeItem("redirectUrlMyPage");
    } else {
      this.router.navigate([AppConstants.APP_URLS.PAGE, AppConstants.DEFAULT_PAGE_ID]);
    }
  }

  setIntervalForSession() {
    this.dataService.setIsInterval(false);
    this.logoutOnClearToken = setInterval(() => {
      if (!this.isUserLoggedIn()) {
        this.logOut();
      }
    }, 2000);
  }

}
